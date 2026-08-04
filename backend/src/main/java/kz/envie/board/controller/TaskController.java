package kz.envie.board.controller;

import kz.envie.board.dto.CreateTaskRequest;
import kz.envie.board.dto.TaskResponse;
import kz.envie.board.dto.UpdateTaskRequest;
import kz.envie.board.service.TaskService;
import kz.envie.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ApiResponse<List<TaskResponse>> getTasks(@PageableDefault(size = 50, sort = "createdAt") Pageable pageable) {
        return ApiResponse.ok(taskService.getAllTasks(pageable).getContent());
    }

    @PostMapping
    public ApiResponse<TaskResponse> createTask(@RequestBody CreateTaskRequest request) {
        return ApiResponse.ok(taskService.createTask(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<TaskResponse> updateTask(@PathVariable UUID id, @RequestBody UpdateTaskRequest request) {
        return ApiResponse.ok(taskService.updateTask(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTask(@PathVariable UUID id) {
        taskService.deleteTask(id);
        return ApiResponse.ok(null);
    }
}
