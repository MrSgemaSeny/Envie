package kz.envie.notes.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class MediaDto {
    private UUID id;
    private String filePath;
    private String originalName;
    private String mediaType;
}
