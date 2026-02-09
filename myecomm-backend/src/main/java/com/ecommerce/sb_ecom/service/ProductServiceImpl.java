package com.ecommerce.sb_ecom.service;

import com.ecommerce.sb_ecom.model.Cart;
import com.ecommerce.sb_ecom.model.Category;
import com.ecommerce.sb_ecom.model.Product;
import com.ecommerce.sb_ecom.model.User;
import com.ecommerce.sb_ecom.payload.CartDTO;
import com.ecommerce.sb_ecom.payload.ProductDTO;
import com.ecommerce.sb_ecom.payload.ProductResponse;
import com.ecommerce.sb_ecom.projectexceptions.APIException;
import com.ecommerce.sb_ecom.projectexceptions.ResourceNotFoundException;
import com.ecommerce.sb_ecom.repositories.CartRepository;
import com.ecommerce.sb_ecom.repositories.CategoryRepository;
import com.ecommerce.sb_ecom.repositories.ProductRepository;
import com.ecommerce.sb_ecom.repositories.UserRepository;
import com.ecommerce.sb_ecom.util.AuthUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Implements product management with category/keyword filtering, image handling,
 * and cart synchronization.
 *
 * <p>Business rules:</p>
 * <ul>
 *   <li>Creation rejects duplicate product names within the same category and
 *       computes {@code specialPrice = price - (discount% * price)}.</li>
 *   <li>The public listing endpoint builds a dynamic JPA {@code Specification}
 *       to combine optional keyword and category filters.</li>
 *   <li>Sort parameters are validated against an allow-list; unknown fields
 *       fall back to {@code productId}.</li>
 *   <li>Updating a product propagates the new price into every cart that
 *       contains it. Deleting a product removes it from all carts first.</li>
 *   <li>Image upload delegates to {@link FileService}; the returned filename
 *       is stored on the product entity.</li>
 *   <li>Seller listing is scoped to products owned by the authenticated user.</li>
 * </ul>
 */
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private ModelMapper modelMapper;
    @Autowired private FileService fileService;
    @Autowired private CartRepository cartRepository;
    @Autowired private CartService cartService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    AuthUtil authUtil;

    @Value("${project.image}")
    private String path;

    @Value("${image.base.url}")
    private String imageBaseUrl;

    // Sorting aliases & whitelist
    private static final Map<String, String> SORT_ALIASES = Map.of(
            "categoryName", "category.categoryName",
            "categoryId", "category.categoryId"
    );

    private static final Set<String> ALLOWED_SORTS = Set.of(
            "productId", "productName", "price", "discount", "specialPrice", "quantity",
            "category.categoryName", "category.categoryId"
    );

    private String normalizeSort(String sortBy) {
        String property = SORT_ALIASES.getOrDefault(sortBy, sortBy);
        return ALLOWED_SORTS.contains(property) ? property : "productId";
    }

    private Pageable buildPageable(int page, int size, String sortBy, String sortDir) {
        String property = normalizeSort(sortBy);
        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by(property).ascending()
                : Sort.by(property).descending();
        return PageRequest.of(page, size, sort);
    }

    private ProductResponse toProductResponse(Page<Product> page, String sortBy, String sortDir) {
        List<ProductDTO> content = page.getContent().stream()
                .map(p -> modelMapper.map(p, ProductDTO.class))
                .toList();

        ProductResponse resp = new ProductResponse();
        resp.setContent(content);
        resp.setPageNumber(page.getNumber());
        resp.setPageSize(page.getSize());
        resp.setTotalElements(page.getTotalElements());
        resp.setTotalPages(page.getTotalPages());
        resp.setLastPage(page.isLast());
        resp.setSortBy(sortBy);
        resp.setSortDir(sortDir);
        return resp;
    }

    // ---------------- PRODUCT CREATION ----------------
    @Override
    public ProductDTO addProduct(Long categoryId, ProductDTO productDTO) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

        boolean exists = category.getProducts().stream()
                .anyMatch(p -> p.getProductName().equalsIgnoreCase(productDTO.getProductName()));
        if (exists) throw new APIException("Product already exist!!");

        Product product = modelMapper.map(productDTO, Product.class);
        product.setImage("default.png");
        product.setCategory(category);
        product.setUser(authUtil.loggedInUser());

        double specialPrice = product.getPrice() - ((product.getDiscount() * 0.01) * product.getPrice());
        product.setSpecialPrice(specialPrice);

        Product saved = productRepository.save(product);
        return modelMapper.map(saved, ProductDTO.class);
    }

    // ---------------- MAIN LIST ENDPOINT ----------------
    @Override
    public ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        return getAllProducts(pageNumber, pageSize, sortBy, sortOrder, null, null);
    }

    @Override
    public ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String keyword, String category) {
        Sort sort = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort);
        //Added because of Backend category and keyword Filtering
        Specification<Product> spec = Specification.allOf();
        if(keyword != null && !keyword.isEmpty()){
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("productName")), "%" + keyword.toLowerCase() + "%"));
        }

        if(category != null && !category.isEmpty()){
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(root.get("category").get("categoryName"), category));
        }

        Page<Product> pageProducts = productRepository.findAll(spec, pageDetails);

        List<ProductDTO> productDTOS = pageProducts.getContent().stream()
                .map(product -> {
                    ProductDTO dto = modelMapper.map(product, ProductDTO.class);
                    dto.setImage(constructImageUrl(product.getImage()));
                    return dto;
                }).toList();

        ProductResponse response = new ProductResponse();
        response.setContent(productDTOS);
        response.setPageNumber(pageProducts.getNumber());
        response.setPageSize(pageProducts.getSize());
        response.setTotalElements(pageProducts.getTotalElements());
        response.setTotalPages(pageProducts.getTotalPages());
        response.setLastPage(pageProducts.isLast());

        return response;
    }

    private String constructImageUrl(String imageName){
        return imageBaseUrl.endsWith("/") ? imageBaseUrl + imageName : imageBaseUrl + "/" + imageName;
    }

    // ---------------- CATEGORY SEARCH ----------------
    @Override
    public ProductResponse searchByCategory(Long categoryId) {
        return searchByCategory(categoryId, 0, 10, "productId", "asc");
    }

    @Override
    public ProductResponse searchByCategory(Long categoryId, int page, int size, String sortBy, String sortDir) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

        Pageable pageable = buildPageable(page, size, sortBy, sortDir);
        Page<Product> pageResult = productRepository.findByCategory(category, pageable);
        return toProductResponse(pageResult, normalizeSort(sortBy), sortDir);
    }

    // ---------------- KEYWORD SEARCH ----------------
    @Override
    public ProductResponse searchProductByKeyword(String keyword) {
        return searchProductByKeyword(keyword, 0, 10, "productName", "asc");
    }

    @Override
    public ProductResponse searchProductByKeyword(String keyword, int page, int size, String sortBy, String sortDir) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDir);
        Page<Product> pageResult = productRepository.findByProductNameContainingIgnoreCase(keyword, pageable);
        return toProductResponse(pageResult, normalizeSort(sortBy), sortDir);
    }

    // ---------------- UPDATE PRODUCT ----------------
    @Override
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
        Product productFromDb = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        Product product = modelMapper.map(productDTO, Product.class);

        productFromDb.setProductName(product.getProductName());
        productFromDb.setDescription(product.getDescription());
        productFromDb.setQuantity(product.getQuantity());
        productFromDb.setDiscount(product.getDiscount());
        productFromDb.setPrice(product.getPrice());
        productFromDb.setSpecialPrice(product.getSpecialPrice());

        Product saved = productRepository.save(productFromDb);

        cartRepository.findByProductsId(productId)
                .forEach(cart -> cartService.updateProductInCarts(cart.getCartId(), productId));

        return modelMapper.map(saved, ProductDTO.class);
    }

    // ---------------- DELETE PRODUCT ----------------
    @Override
    public ProductDTO deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        cartRepository.findByProductsId(productId)
                .forEach(cart -> cartService.deleteProductFromCart(cart.getCartId(), productId));

        productRepository.delete(product);
        return modelMapper.map(product, ProductDTO.class);
    }

    // ---------------- UPDATE IMAGE ----------------
    @Override
    public ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException {
        Product productFromDb = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        String fileName = fileService.uploadImage(path, image);
        productFromDb.setImage(fileName);

        Product updated = productRepository.save(productFromDb);
        return modelMapper.map(updated, ProductDTO.class);
    }
    //Getting products for Admin
    @Override
    public ProductResponse getAllProductsForAdmin(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {

        Sort sort = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort);
        //Added because of Backend category and keyword Filtering


        Page<Product> pageProducts = productRepository.findAll(pageDetails);

        List<ProductDTO> productDTOS = pageProducts.getContent().stream()
                .map(product -> {
                    ProductDTO dto = modelMapper.map(product, ProductDTO.class);
                    dto.setImage(constructImageUrl(product.getImage()));
                    return dto;
                }).toList();

        ProductResponse response = new ProductResponse();
        response.setContent(productDTOS);
        response.setPageNumber(pageProducts.getNumber());
        response.setPageSize(pageProducts.getSize());
        response.setTotalElements(pageProducts.getTotalElements());
        response.setTotalPages(pageProducts.getTotalPages());
        response.setLastPage(pageProducts.isLast());

        return response;
    }

    @Override
    public ProductResponse getAllProductsForSeller(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort);
        //Added because of Backend category and keyword Filtering

        User user = authUtil.loggedInUser();
        Page<Product> pageProducts = productRepository.findByUser(user,pageDetails);

        List<ProductDTO> productDTOS = pageProducts.getContent().stream()
                .map(product -> {
                    ProductDTO dto = modelMapper.map(product, ProductDTO.class);
                    dto.setImage(constructImageUrl(product.getImage()));
                    return dto;
                }).toList();

        ProductResponse response = new ProductResponse();
        response.setContent(productDTOS);
        response.setPageNumber(pageProducts.getNumber());
        response.setPageSize(pageProducts.getSize());
        response.setTotalElements(pageProducts.getTotalElements());
        response.setTotalPages(pageProducts.getTotalPages());
        response.setLastPage(pageProducts.isLast());

        return response;
    }


}
