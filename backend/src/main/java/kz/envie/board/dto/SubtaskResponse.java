package kz.envie.board.dto;

import java.time.ZonedDateTime;
import java.util.UUID;

public record SubtaskResponse(
        UUID id,
        UUID taskId,
        String title,
        boolean done,
        ZonedDateTime createdAt
) {}
