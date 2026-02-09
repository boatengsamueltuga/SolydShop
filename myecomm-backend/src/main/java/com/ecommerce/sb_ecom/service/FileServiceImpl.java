package com.ecommerce.sb_ecom.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Stores uploaded images on the local filesystem under the project root.
 *
 * <p>Each file is saved with a UUID-based name to avoid collisions.
 * The upload directory is created automatically if it does not exist.</p>
 */
@Service
public class FileServiceImpl implements FileService {

    @Override
    public String uploadImage(String dir, MultipartFile file) throws IOException {

        //Resolve relative to PROJECT ROOT (NOT resources)
        Path uploadDir = Paths.get(System.getProperty("user.dir"))
                .resolve(dir)
                .normalize();

        Files.createDirectories(uploadDir);

        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName.substring(originalFileName.lastIndexOf('.'));

        String fileName = UUID.randomUUID().toString().concat(extension);


        Path filePath = uploadDir.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("Uploaded to: " + filePath.toAbsolutePath());

        return fileName;
    }
}
