package kz.envie.board.service;

import kz.envie.board.dto.*;
import kz.envie.board.entity.SubtaskEntity;
import kz.envie.board.entity.TaskEntity;
import kz.envie.board.repository.SubtaskRepository;
import kz.envie.board.repository.TaskRepository;
import kz.envie.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final SubtaskRepository subtaskRepository;

    @Transactional(readOnly = true)
    public Page<TaskResponse> getAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional
    public TaskResponse createTask(CreateTaskRequest request) {
        TaskEntity task = new TaskEntity();
        task.setTitle(request.title());
        task.setDescription(request.description());
        TaskEntity saved = taskRepository.save(task);
        return mapToResponse(saved);
    }

    @Transactional
    public TaskResponse updateTask(UUID id, UpdateTaskRequest request) {
        TaskEntity task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        if (request.title() != null) {
            task.setTitle(request.title());
        }
        if (request.description() != null) {
            task.setDescription(request.description());
        }
        
        TaskEntity saved = taskRepository.save(task);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteTask(UUID id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found");
        }
        taskRepository.deleteById(id);
    }

    // Subtask operations
    @Transactional
    public SubtaskResponse createSubtask(UUID taskId, CreateSubtaskRequest request) {
        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        SubtaskEntity subtask = new SubtaskEntity();
        subtask.setTask(task);
        subtask.setTitle(request.title());
        subtask.setDone(false);
        
        SubtaskEntity saved = subtaskRepository.save(subtask);
        return mapToSubtaskResponse(saved);
    }

    @Transactional
    public SubtaskResponse updateSubtask(UUID subtaskId, UpdateSubtaskRequest request) {
        SubtaskEntity subtask = subtaskRepository.findById(subtaskId)
                .orElseThrow(() -> new ResourceNotFoundException("Subtask not found"));
        
        if (request.title() != null) {
            subtask.setTitle(request.title());
        }
        if (request.done() != null) {
            subtask.setDone(request.done());
        }
        
        SubtaskEntity saved = subtaskRepository.save(subtask);
        return mapToSubtaskResponse(saved);
    }

    @Transactional
    public void deleteSubtask(UUID subtaskId) {
        if (!subtaskRepository.existsById(subtaskId)) {
            throw new ResourceNotFoundException("Subtask not found");
        }
        subtaskRepository.deleteById(subtaskId);
    }

    // Mappers
    private TaskResponse mapToResponse(TaskEntity entity) {
        List<SubtaskResponse> subtasks = entity.getSubtasks().stream()
                .map(this::mapToSubtaskResponse)
                .collect(Collectors.toList());

        return new TaskResponse(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                subtasks
        );
    }

    private SubtaskResponse mapToSubtaskResponse(SubtaskEntity entity) {
        return new SubtaskResponse(
                entity.getId(),
                entity.getTask().getId(),
                entity.getTitle(),
                entity.isDone(),
                entity.getCreatedAt()
        );
    }
}
