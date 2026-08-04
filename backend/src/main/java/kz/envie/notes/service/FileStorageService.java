package kz.envie.notes.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDir;

    public FileStorageService(@Value("${envie.upload-dir:./uploads}") String uploadDirPath) {
        this.uploadDir = Paths.get(uploadDirPath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directory.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            
            String newFilename = UUID.randomUUID().toString() + extension;
            Path targetLocation = this.uploadDir.resolve(newFilename);
            Files.copy(file.getInputStream(), targetLocation);
            
            return newFilename;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }
    
    public Path getFilePath(String filename) {
        return this.uploadDir.resolve(filename).normalize();
    }
}
