package kz.envie.wallpaper;

import kz.envie.shared.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wallpapers")
public class WallpaperController {

    private final WallpaperService wallpaperService;

    public WallpaperController(WallpaperService wallpaperService) {
        this.wallpaperService = wallpaperService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WallpaperDto>>> getAllWallpapers() {
        return ResponseEntity.ok(ApiResponse.ok(wallpaperService.getAllWallpapers()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<WallpaperDto>>> getActiveWallpapers() {
        return ResponseEntity.ok(ApiResponse.ok(wallpaperService.getActiveWallpapers()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WallpaperDto>> uploadWallpaper(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.ok(wallpaperService.uploadWallpaper(file)));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<WallpaperDto>> activateWallpaper(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(wallpaperService.activateWallpaper(id)));
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateWallpaper(@PathVariable UUID id) {
        wallpaperService.deactivateWallpaper(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @PutMapping("/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateAllWallpapers() {
        wallpaperService.deactivateAll();
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWallpaper(@PathVariable UUID id) {
        wallpaperService.deleteWallpaper(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
