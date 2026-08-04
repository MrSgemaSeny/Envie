package kz.envie.board.dto;

public record UpdateTaskRequest(
        String title,
        String description
) {}
