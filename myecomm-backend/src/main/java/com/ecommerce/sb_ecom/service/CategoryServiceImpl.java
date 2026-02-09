package com.ecommerce.sb_ecom.service;

import com.ecommerce.sb_ecom.model.Category;
import com.ecommerce.sb_ecom.payload.CategoryDTO;
import com.ecommerce.sb_ecom.payload.CategoryResponse;
import com.ecommerce.sb_ecom.projectexceptions.APIException;
import com.ecommerce.sb_ecom.projectexceptions.ResourceNotFoundException;
import com.ecommerce.sb_ecom.repositories.CategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;


/**
 * Implements category CRUD with pagination and duplicate-name prevention.
 *
 * <p>Business rules:</p>
 * <ul>
 *   <li>Listing throws {@code APIException} when no categories exist.</li>
 *   <li>Creation rejects categories whose name already exists in the database.</li>
 *   <li>Delete and update throw {@code ResourceNotFoundException} for unknown IDs.</li>
 * </ul>
 */
@Service
public class CategoryServiceImpl implements CategoryService{


    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public CategoryResponse getAllCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {

      Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
              ? Sort.by(sortBy).ascending()
              :Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Category> categoryPage = categoryRepository.findAll(pageDetails);
        List<Category> categories = categoryPage.getContent();
        if(categories.isEmpty())
            throw new APIException("No category created till now.");
    List<CategoryDTO> categoryDTOS = categories.stream()
            .map(category -> modelMapper.map(category, CategoryDTO.class))
            .toList();
    CategoryResponse categoryResponse = new CategoryResponse();
    categoryResponse.setContent(categoryDTOS);
    categoryResponse.setPageNumber(categoryPage.getNumber());
    categoryResponse.setPageSize(categoryPage.getSize());
    categoryResponse.setTotalElements(categoryPage.getTotalElements());
    categoryResponse.setTotalPages(categoryPage.getTotalPages());
    categoryResponse.setLastPage(categoryPage.isLast());
        return categoryResponse;
    }



    @Override
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = modelMapper.map(categoryDTO, Category.class);
        Category categoryFromDb = categoryRepository.findByCategoryName(category.getCategoryName());
        if(categoryFromDb != null)
            throw new APIException("Category with the name " + category.getCategoryName() + " already exist !!!");
        //category.setCategoryId(nextId++);
        Category savedCategory = categoryRepository.save(category);

        return modelMapper.map(savedCategory, CategoryDTO.class);
    }

@Override
public CategoryDTO deleteCategory(Long categoryId) {
    Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException(
                    "Category", "categoryId", categoryId));

    categoryRepository.delete(category);

    return modelMapper.map(category,CategoryDTO.class);
}

    @Override
    public CategoryDTO updateCategory(CategoryDTO updatedCategoryDTO, Long categoryId) {
        Category existingCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category", "categoryId", categoryId));
        Category category = modelMapper.map(updatedCategoryDTO, Category.class);
        existingCategory.setCategoryName(updatedCategoryDTO.getCategoryName());
        // existingCategory.setDescription(updatedCategory.getDescription());
        // Update other fields as needed

        return modelMapper.map(existingCategory, CategoryDTO.class);
    }



}
