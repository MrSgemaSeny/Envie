package kz.envie.board.repository;

import kz.envie.board.entity.TaskEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, UUID> {
    
    @EntityGraph(attributePaths = {"subtasks"})
    Page<TaskEntity> findAll(Pageable pageable);
}
