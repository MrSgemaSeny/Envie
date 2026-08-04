package kz.envie.notes.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "notes")
@Getter
@Setter
public class NoteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private boolean pinned = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private ZonedDateTime updatedAt;

    @OneToMany(mappedBy = "note", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<NoteTagEntity> tags = new LinkedHashSet<>();

    @OneToMany(mappedBy = "note", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<NoteMediaEntity> media = new LinkedHashSet<>();

    public void addTag(NoteTagEntity tag) {
        tags.add(tag);
        tag.setNote(this);
    }

    public void removeTag(NoteTagEntity tag) {
        tags.remove(tag);
        tag.setNote(null);
    }

    public void addMedia(NoteMediaEntity m) {
        media.add(m);
        m.setNote(this);
    }

    public void removeMedia(NoteMediaEntity m) {
        media.remove(m);
        m.setNote(null);
    }
}
