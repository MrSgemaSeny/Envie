package kz.envie.ideas.repository;

import kz.envie.ideas.entity.IdeaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface IdeaRepository extends JpaRepository<IdeaEntity, UUID> {
    Page<IdeaEntity> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
