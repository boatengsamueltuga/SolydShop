package com.ecommerce.sb_ecom.payload;

import lombok.Data;
import java.util.List;

/**
 * Paginated response wrapper returned by product listing endpoints.
 * Includes the page of {@link ProductDTO} items, pagination metadata,
 * and the sort parameters echoed back to the caller.
 */
@Data
public class ProductResponse {
    private List<ProductDTO> content;

    private int pageNumber;       // page.getNumber()
    private int pageSize;         // page.getSize()
    private long totalElements;   // page.getTotalElements() <-- long
    private int totalPages;       // page.getTotalPages()
    private boolean lastPage;     // page.isLast()

    private String sortBy;        // for echoing sort info
    private String sortDir;
}
