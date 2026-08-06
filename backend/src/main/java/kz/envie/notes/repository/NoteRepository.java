package kz.envie.notes.repository;

import kz.envie.notes.entity.NoteEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface NoteRepository extends JpaRepository<NoteEntity, UUID> {
    @EntityGraph(attributePaths = {"tags", "media"})
    @Query("SELECT DISTINCT n FROM NoteEntity n LEFT JOIN n.tags t WHERE :search IS NULL OR LOWER(n.content) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.tag) LIKE LOWER(CONCAT('%', :search, '%')) ORDER BY n.pinned DESC, n.createdAt DESC")
    Page<NoteEntity> searchNotes(@org.springframework.data.repository.query.Param("search") String search, Pageable pageable);
    
}
