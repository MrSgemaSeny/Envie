package kz.envie.wallpaper;

import kz.envie.notes.service.FileStorageService;
import kz.envie.shared.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WallpaperService {

    private final WallpaperRepository wallpaperRepository;
    private final FileStorageService fileStorageService;

    public WallpaperService(WallpaperRepository wallpaperRepository, FileStorageService fileStorageService) {
        this.wallpaperRepository = wallpaperRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public List<WallpaperDto> getAllWallpapers() {
        return wallpaperRepository.findAll().stream()
                .map(WallpaperDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<WallpaperDto> getActiveWallpaper() {
        return wallpaperRepository.findByIsActiveTrue()
                .map(WallpaperDto::fromEntity);
    }

    @Transactional
    public WallpaperDto uploadWallpaper(MultipartFile file) {
        String filename = fileStorageService.storeFile(file);
        
        WallpaperEntity entity = new WallpaperEntity(
                UUID.randomUUID(),
                filename,
                file.getOriginalFilename() != null ? file.getOriginalFilename() : filename
        );
        
        WallpaperEntity saved = wallpaperRepository.save(entity);
        return WallpaperDto.fromEntity(saved);
    }

    @Transactional
    public WallpaperDto activateWallpaper(UUID id) {
        wallpaperRepository.deactivateAll();
        
        WallpaperEntity entity = wallpaperRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wallpaper not found with id " + id));
        
        entity.setActive(true);
        
        WallpaperEntity saved = wallpaperRepository.save(entity);
        return WallpaperDto.fromEntity(saved);
    }

    @Transactional
    public void deleteWallpaper(UUID id) {
        WallpaperEntity entity = wallpaperRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wallpaper not found with id " + id));
        
        wallpaperRepository.delete(entity);
        
        try {
            Files.deleteIfExists(fileStorageService.getFilePath(entity.getFilename()));
        } catch (Exception e) {
            // Log and ignore file deletion error to not rollback DB transaction just for file
        }
    }
}
