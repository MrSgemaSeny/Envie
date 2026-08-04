package kz.envie.notes.repository;

import kz.envie.notes.entity.NoteMediaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface NoteMediaRepository extends JpaRepository<NoteMediaEntity, UUID> {
}
