package kz.envie.notes.service;

import kz.envie.notes.dto.MediaDto;
import kz.envie.notes.dto.NoteDto;
import kz.envie.notes.entity.NoteEntity;
import kz.envie.notes.entity.NoteMediaEntity;
import kz.envie.notes.entity.NoteTagEntity;
import kz.envie.notes.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public Page<NoteDto> getAllNotes(Pageable pageable) {
        return noteRepository.findAllByOrderByPinnedDescCreatedAtDesc(pageable)
                .map(this::mapToDto);
    }

    @Transactional
    public NoteDto createNote(String content, List<String> tags, List<MultipartFile> files) {
        NoteEntity note = new NoteEntity();
        note.setContent(content);

        if (tags != null) {
            for (String tag : tags) {
                if (tag != null && !tag.trim().isEmpty()) {
                    NoteTagEntity tagEntity = new NoteTagEntity();
                    tagEntity.setTag(tag.trim());
                    note.addTag(tagEntity);
                }
            }
        }

        if (files != null) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String savedFilename = fileStorageService.storeFile(file);
                    NoteMediaEntity media = new NoteMediaEntity();
                    media.setFilePath(savedFilename);
                    media.setOriginalName(file.getOriginalFilename());
                    media.setMediaType(file.getContentType());
                    note.addMedia(media);
                }
            }
        }

        NoteEntity saved = noteRepository.save(note);
        return mapToDto(saved);
    }

    @Transactional
    public NoteDto togglePin(UUID id) {
        NoteEntity note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        note.setPinned(!note.isPinned());
        return mapToDto(noteRepository.save(note));
    }

    @Transactional
    public void deleteNote(UUID id) {
        NoteEntity note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));
                
        for (NoteMediaEntity media : note.getMedia()) {
            fileStorageService.deleteFile(media.getFilePath());
        }
        
        noteRepository.deleteById(id);
    }

    private NoteDto mapToDto(NoteEntity entity) {
        NoteDto dto = new NoteDto();
        dto.setId(entity.getId());
        dto.setContent(entity.getContent());
        dto.setPinned(entity.isPinned());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        
        dto.setTags(entity.getTags().stream()
                .map(NoteTagEntity::getTag)
                .collect(Collectors.toList()));
                
        dto.setMedia(entity.getMedia().stream()
                .map(m -> {
                    MediaDto md = new MediaDto();
                    md.setId(m.getId());
                    md.setFilePath(m.getFilePath());
                    md.setMediaType(m.getMediaType());
                    md.setOriginalName(m.getOriginalName());
                    return md;
                })
                .collect(Collectors.toList()));
                
        return dto;
    }
}
