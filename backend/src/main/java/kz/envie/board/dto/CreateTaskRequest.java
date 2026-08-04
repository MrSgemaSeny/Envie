package kz.envie.board.dto;

public record CreateTaskRequest(
        String title,
        String description
) {}
