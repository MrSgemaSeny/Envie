package kz.envie.board.dto;

public record UpdateSubtaskRequest(
        String title,
        Boolean done
) {}
