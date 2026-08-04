package kz.envie.board.dto;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public record TaskResponse(
        UUID id,
        String title,
        String description,
        ZonedDateTime createdAt,
        ZonedDateTime updatedAt,
        List<SubtaskResponse> subtasks
) {}
