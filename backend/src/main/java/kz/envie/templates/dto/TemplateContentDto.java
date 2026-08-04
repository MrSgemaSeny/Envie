package kz.envie.templates.dto;

import java.time.ZonedDateTime;

public record TemplateContentDto(
        String name,
        String content,
        ZonedDateTime updatedAt
) {}
