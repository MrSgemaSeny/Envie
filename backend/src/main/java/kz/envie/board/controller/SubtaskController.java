package kz.envie.board.controller;

import kz.envie.board.dto.CreateSubtaskRequest;
import kz.envie.board.dto.SubtaskResponse;
import kz.envie.board.dto.UpdateSubtaskRequest;
import kz.envie.board.service.TaskService;
import kz.envie.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SubtaskController {

    private final TaskService taskService;

    @PostMapping("/tasks/{taskId}/subtasks")
    public ApiResponse<SubtaskResponse> createSubtask(@PathVariable UUID taskId, @RequestBody CreateSubtaskRequest request) {
        return ApiResponse.ok(taskService.createSubtask(taskId, request));
    }

    @PutMapping("/subtasks/{id}")
    public ApiResponse<SubtaskResponse> updateSubtask(@PathVariable UUID id, @RequestBody UpdateSubtaskRequest request) {
        return ApiResponse.ok(taskService.updateSubtask(id, request));
    }

    @DeleteMapping("/subtasks/{id}")
    public ApiResponse<Void> deleteSubtask(@PathVariable UUID id) {
        taskService.deleteSubtask(id);
        return ApiResponse.ok(null);
    }
}
