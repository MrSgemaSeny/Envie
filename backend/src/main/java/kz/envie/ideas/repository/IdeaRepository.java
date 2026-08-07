package kz.envie.ideas.repository;

import kz.envie.ideas.entity.IdeaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface IdeaRepository extends JpaRepository<IdeaEntity, UUID> {
    @org.springframework.data.jpa.repository.Query("SELECT i FROM IdeaEntity i WHERE cast(:search as string) IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) OR LOWER(i.summary) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) ORDER BY i.createdAt DESC")
    Page<IdeaEntity> searchIdeas(@org.springframework.data.repository.query.Param("search") String search, Pageable pageable);
}
