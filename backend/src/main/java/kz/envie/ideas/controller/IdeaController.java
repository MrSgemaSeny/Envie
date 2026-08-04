package kz.envie.ideas.controller;

import kz.envie.ideas.dto.CreateIdeaRequest;
import kz.envie.ideas.dto.IdeaResponse;
import kz.envie.ideas.dto.UpdateIdeaRequest;
import kz.envie.ideas.service.IdeaService;
import kz.envie.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ideas")
@RequiredArgsConstructor
public class IdeaController {

    private final IdeaService ideaService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<IdeaResponse>>> getIdeas(Pageable pageable) {
        List<IdeaResponse> ideas = ideaService.getIdeas(pageable).getContent();
        return ResponseEntity.ok(ApiResponse.ok(ideas));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<IdeaResponse>> createIdea(@RequestBody CreateIdeaRequest request) {
        IdeaResponse created = ideaService.createIdea(request);
        return ResponseEntity.ok(ApiResponse.ok(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<IdeaResponse>> updateIdea(
            @PathVariable UUID id,
            @RequestBody UpdateIdeaRequest request) {
        IdeaResponse updated = ideaService.updateIdea(id, request);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteIdea(@PathVariable UUID id) {
        ideaService.deleteIdea(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @PostMapping("/{id}/generate-architecture")
    public ResponseEntity<ApiResponse<IdeaResponse>> generateArchitecture(@PathVariable UUID id) {
        IdeaResponse updated = ideaService.generateArchitecture(id);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }
}
