package kz.envie.templates.service;

import kz.envie.shared.exception.ResourceNotFoundException;
import kz.envie.templates.dto.TemplateContentDto;
import kz.envie.templates.dto.TemplateDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class TemplateService {

    private final Path templatesDir;

    public TemplateService(@Value("${envie.templates-dir:../templates}") String templatesDirPath) {
        this.templatesDir = Paths.get(templatesDirPath).toAbsolutePath().normalize();
        if (!Files.exists(this.templatesDir)) {
            try {
                Files.createDirectories(this.templatesDir);
            } catch (IOException e) {
                throw new RuntimeException("Could not create templates directory", e);
            }
        }
    }

    public List<TemplateDto> getTemplates() {
        try (Stream<Path> paths = Files.walk(templatesDir, 1)) {
            return paths
                    .filter(Files::isRegularFile)
                    .filter(path -> path.toString().endsWith(".md"))
                    .map(path -> {
                        String name = path.getFileName().toString();
                        ZonedDateTime updatedAt = getFileLastModifiedTime(path);
                        return new TemplateDto(name, updatedAt);
                    })
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("Failed to read templates directory", e);
        }
    }

    public TemplateContentDto getTemplate(String name) {
        Path filePath = resolveAndValidatePath(name);
        if (!Files.exists(filePath)) {
            throw new ResourceNotFoundException("Template not found: " + name);
        }
        try {
            String content = Files.readString(filePath);
            ZonedDateTime updatedAt = getFileLastModifiedTime(filePath);
            return new TemplateContentDto(name, content, updatedAt);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read template: " + name, e);
        }
    }

    public TemplateContentDto updateTemplate(String name, String newContent) {
        Path filePath = resolveAndValidatePath(name);
        if (!Files.exists(filePath)) {
            throw new ResourceNotFoundException("Template not found: " + name);
        }
        try {
            Files.writeString(filePath, newContent);
            ZonedDateTime updatedAt = getFileLastModifiedTime(filePath);
            return new TemplateContentDto(name, newContent, updatedAt);
        } catch (IOException e) {
            throw new RuntimeException("Failed to write template: " + name, e);
        }
    }

    private Path resolveAndValidatePath(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Template name cannot be empty");
        }
        if (!name.endsWith(".md")) {
            throw new IllegalArgumentException("Invalid file extension. Only .md is allowed.");
        }
        
        Path resolvedPath = this.templatesDir.resolve(name).normalize();
        
        if (!resolvedPath.startsWith(this.templatesDir)) {
            throw new RuntimeException("Path traversal attempt detected!");
        }
        
        return resolvedPath;
    }

    private ZonedDateTime getFileLastModifiedTime(Path path) {
        try {
            FileTime lastModifiedTime = Files.getLastModifiedTime(path);
            return ZonedDateTime.ofInstant(lastModifiedTime.toInstant(), ZoneId.systemDefault());
        } catch (IOException e) {
            return ZonedDateTime.now();
        }
    }
}
