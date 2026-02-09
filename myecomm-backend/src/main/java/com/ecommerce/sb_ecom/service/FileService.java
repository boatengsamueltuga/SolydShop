package com.ecommerce.sb_ecom.service;


import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * File storage contract for product image uploads.
 */
public interface FileService {

    /**
     * Saves the uploaded file to the given directory and returns the generated filename.
     */
    String uploadImage(String dir, MultipartFile file) throws IOException;
}
