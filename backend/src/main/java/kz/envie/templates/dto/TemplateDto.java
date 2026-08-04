package kz.envie.templates.dto;

import java.time.ZonedDateTime;

public record TemplateDto(
        String name,
        ZonedDateTime updatedAt
) {}
