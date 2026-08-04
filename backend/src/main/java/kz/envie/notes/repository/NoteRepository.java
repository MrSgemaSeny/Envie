package kz.envie.notes.repository;

import kz.envie.notes.entity.NoteEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NoteRepository extends JpaRepository<NoteEntity, UUID> {
    
    @EntityGraph(attributePaths = {"tags", "media"})
    Page<NoteEntity> findAllByOrderByPinnedDescCreatedAtDesc(Pageable pageable);
    
}
