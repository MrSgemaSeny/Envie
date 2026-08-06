package kz.envie.templates.service;

import kz.envie.shared.exception.ResourceNotFoundException;
import kz.envie.templates.dto.TemplateContentDto;
import kz.envie.templates.dto.TemplateDto;
import kz.envie.templates.entity.TemplateEntity;
import kz.envie.templates.repository.TemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TemplateService {

    private final TemplateRepository templateRepository;
    
    @org.springframework.beans.factory.annotation.Value("${envie.templates-dir:templates}")
    private String templatesDir;

    @jakarta.annotation.PostConstruct
    public void init() {
        try {
            java.nio.file.Path dirPath = java.nio.file.Paths.get(templatesDir);
            if (!java.nio.file.Files.exists(dirPath)) return;
            
            try (java.util.stream.Stream<java.nio.file.Path> paths = java.nio.file.Files.list(dirPath)) {
                paths.filter(p -> p.toString().endsWith(".md"))
                     .forEach(p -> {
                         String name = p.getFileName().toString();
                         if (templateRepository.findByName(name).isEmpty()) {
                             try {
                                 String content = java.nio.file.Files.readString(p);
                                 TemplateEntity entity = new TemplateEntity();
                                 entity.setName(name);
                                 entity.setContent(content);
                                 templateRepository.save(entity);
                             } catch (Exception e) {
                                 // Ignore individual file read errors
                             }
                         }
                     });
            }
        } catch (Exception e) {
            // Ignore directory read errors
        }
    }

    @Transactional(readOnly = true)
    public List<TemplateDto> getTemplates() {
        return templateRepository.findAll().stream()
                .map(t -> new TemplateDto(t.getName(), t.getUpdatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TemplateContentDto getTemplate(String name) {
        TemplateEntity entity = templateRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found: " + name));
        return new TemplateContentDto(entity.getName(), entity.getContent(), entity.getUpdatedAt());
    }

    @Transactional
    public TemplateContentDto updateTemplate(String name, String newContent) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Template name cannot be empty");
        }
        if (!name.endsWith(".md")) {
            throw new IllegalArgumentException("Invalid file extension. Only .md is allowed.");
        }

        TemplateEntity entity = templateRepository.findByName(name).orElseGet(() -> {
            TemplateEntity newEntity = new TemplateEntity();
            newEntity.setName(name);
            return newEntity;
        });

        entity.setContent(newContent);
        TemplateEntity saved = templateRepository.save(entity);

        return new TemplateContentDto(saved.getName(), saved.getContent(), saved.getUpdatedAt());
    }
}
