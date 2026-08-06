package kz.envie.notes.controller;

import kz.envie.notes.dto.NoteDto;
import kz.envie.notes.service.NoteService;
import kz.envie.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public ApiResponse<List<NoteDto>> getNotes(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 50, sort = "createdAt") Pageable pageable) {
        Page<NoteDto> notesPage = noteService.getAllNotes(search, pageable);
        return ApiResponse.ok(notesPage.getContent());
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ApiResponse<NoteDto> createNote(
            @RequestParam("content") String content,
            @RequestParam(value = "tags", required = false) String tagsStr,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
            
        List<String> tags = Collections.emptyList();
        if (tagsStr != null && !tagsStr.trim().isEmpty()) {
            tags = Arrays.stream(tagsStr.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }
        
        NoteDto created = noteService.createNote(content, tags, files);
        return ApiResponse.ok(created);
    }

    @PutMapping("/{id}/pin")
    public ApiResponse<NoteDto> togglePin(@PathVariable UUID id) {
        return ApiResponse.ok(noteService.togglePin(id));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteNote(@PathVariable UUID id) {
        noteService.deleteNote(id);
        return ApiResponse.ok(null);
    }
}
