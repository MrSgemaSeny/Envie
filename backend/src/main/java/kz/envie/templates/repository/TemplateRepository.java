package kz.envie.templates.repository;

import kz.envie.templates.entity.TemplateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TemplateRepository extends JpaRepository<TemplateEntity, UUID> {
    Optional<TemplateEntity> findByName(String name);
}
