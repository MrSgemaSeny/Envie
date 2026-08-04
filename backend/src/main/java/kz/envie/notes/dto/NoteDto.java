package kz.envie.notes.dto;

import lombok.Data;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class NoteDto {
    private UUID id;
    private String content;
    private boolean pinned;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private List<String> tags;
    private List<MediaDto> media;
}
