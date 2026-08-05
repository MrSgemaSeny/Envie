package kz.envie.wallpaper;

import java.time.Instant;
import java.util.UUID;

public record WallpaperDto(
    UUID id,
    String filename,
    String originalName,
    boolean isActive,
    Instant createdAt
) {
    public static WallpaperDto fromEntity(WallpaperEntity entity) {
        return new WallpaperDto(
            entity.getId(),
            entity.getFilename(),
            entity.getOriginalName(),
            entity.isActive(),
            entity.getCreatedAt()
        );
    }
}
