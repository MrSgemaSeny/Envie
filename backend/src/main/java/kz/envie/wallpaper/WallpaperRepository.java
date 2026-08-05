package kz.envie.wallpaper;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WallpaperRepository extends JpaRepository<WallpaperEntity, UUID> {
    
    Optional<WallpaperEntity> findByIsActiveTrue();

    @Modifying(clearAutomatically = true)
    @Query("UPDATE WallpaperEntity w SET w.isActive = false")
    void deactivateAll();
}
