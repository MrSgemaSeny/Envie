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
