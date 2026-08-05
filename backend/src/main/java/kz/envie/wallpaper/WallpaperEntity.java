package kz.envie.wallpaper;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "wallpapers")
public class WallpaperEntity {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String filename;

    @Column(name = "original_name", nullable = false)
    private String originalName;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public WallpaperEntity() {}

    public WallpaperEntity(UUID id, String filename, String originalName) {
        this.id = id;
        this.filename = filename;
        this.originalName = originalName;
        this.createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getOriginalName() {
        return originalName;
    }

    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
