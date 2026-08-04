package kz.envie.ideas.service;

import kz.envie.ideas.client.AnthropicClient;
import kz.envie.ideas.dto.CreateIdeaRequest;
import kz.envie.ideas.dto.IdeaResponse;
import kz.envie.ideas.dto.UpdateIdeaRequest;
import kz.envie.ideas.entity.IdeaEntity;
import kz.envie.ideas.entity.IdeaStatus;
import kz.envie.ideas.repository.IdeaRepository;
import kz.envie.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IdeaService {

    private final IdeaRepository ideaRepository;
    private final AnthropicClient anthropicClient;

    @Transactional(readOnly = true)
    public Page<IdeaResponse> getIdeas(Pageable pageable) {
        return ideaRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public IdeaResponse createIdea(CreateIdeaRequest request) {
        IdeaEntity idea = new IdeaEntity();
        idea.setTitle(request.title());
        idea.setSummary(request.summary());
        idea.setProblem(request.problem());
        idea.setSolution(request.solution());
        idea.setAudience(request.audience());
        idea.setMonetization(request.monetization());
        idea.setStatus(request.status() != null ? request.status() : IdeaStatus.RAW);
        
        return mapToResponse(ideaRepository.save(idea));
    }

    @Transactional
    public IdeaResponse updateIdea(UUID id, UpdateIdeaRequest request) {
        IdeaEntity idea = ideaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Idea not found"));
                
        idea.setTitle(request.title());
        idea.setSummary(request.summary());
        idea.setProblem(request.problem());
        idea.setSolution(request.solution());
        idea.setAudience(request.audience());
        idea.setMonetization(request.monetization());
        idea.setStatus(request.status() != null ? request.status() : idea.getStatus());
        
        return mapToResponse(ideaRepository.save(idea));
    }

    @Transactional
    public void deleteIdea(UUID id) {
        if (!ideaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Idea not found");
        }
        ideaRepository.deleteById(id);
    }

    @Transactional
    public IdeaResponse generateArchitecture(UUID id) {
        IdeaEntity idea = ideaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Idea not found"));
                
        try {
            Path promptPath = Paths.get("../templates/AI_IDEA_PROMPT.md");
            String promptTemplate = Files.readString(promptPath);
            
            String prompt = promptTemplate
                    .replace("{{TITLE}}", idea.getTitle() != null ? idea.getTitle() : "")
                    .replace("{{SUMMARY}}", idea.getSummary() != null ? idea.getSummary() : "")
                    .replace("{{PROBLEM}}", idea.getProblem() != null ? idea.getProblem() : "")
                    .replace("{{SOLUTION}}", idea.getSolution() != null ? idea.getSolution() : "")
                    .replace("{{AUDIENCE}}", idea.getAudience() != null ? idea.getAudience() : "")
                    .replace("{{MONETIZATION}}", idea.getMonetization() != null ? idea.getMonetization() : "");
                    
            String aiResponse = anthropicClient.generateArchitecture(prompt);
            
            idea.setAiArchitecture(aiResponse);
            return mapToResponse(ideaRepository.save(idea));
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate architecture: " + e.getMessage(), e);
        }
    }

    private IdeaResponse mapToResponse(IdeaEntity idea) {
        return new IdeaResponse(
                idea.getId(),
                idea.getTitle(),
                idea.getSummary(),
                idea.getProblem(),
                idea.getSolution(),
                idea.getAudience(),
                idea.getMonetization(),
                idea.getStatus(),
                idea.getAiArchitecture(),
                idea.getCreatedAt(),
                idea.getUpdatedAt()
        );
    }
}
