package kz.envie.ideas.dto;

import kz.envie.ideas.entity.IdeaStatus;

import java.time.ZonedDateTime;
import java.util.UUID;

public record IdeaResponse(
        UUID id,
        String title,
        String summary,
        String problem,
        String solution,
        String audience,
        String monetization,
        IdeaStatus status,
        ZonedDateTime createdAt,
        ZonedDateTime updatedAt
) {
}
