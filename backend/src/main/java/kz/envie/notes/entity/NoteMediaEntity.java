package kz.envie.notes.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "note_media")
@Getter
@Setter
public class NoteMediaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id", nullable = false)
    private NoteEntity note;

    @Column(name = "file_path", nullable = false, length = 512)
    private String filePath;

    @Column(name = "media_type", nullable = false, length = 100)
    private String mediaType;

    @Column(name = "original_name", nullable = false)
    private String originalName;
}
