package kz.envie.ideas.dto;

import kz.envie.ideas.entity.IdeaStatus;

public record UpdateIdeaRequest(
        String title,
        String summary,
        String problem,
        String solution,
        String audience,
        String monetization,
        IdeaStatus status
) {
}
