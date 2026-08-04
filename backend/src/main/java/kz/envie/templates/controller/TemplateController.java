package kz.envie.templates.controller;

import kz.envie.shared.ApiResponse;
import kz.envie.templates.dto.TemplateContentDto;
import kz.envie.templates.dto.TemplateDto;
import kz.envie.templates.dto.UpdateTemplateRequest;
import kz.envie.templates.service.TemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/templates")
@RequiredArgsConstructor
public class TemplateController {

    private final TemplateService templateService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TemplateDto>>> getTemplates() {
        List<TemplateDto> templates = templateService.getTemplates();
        return ResponseEntity.ok(ApiResponse.ok(templates));
    }

    @GetMapping("/{name:.+}")
    public ResponseEntity<ApiResponse<TemplateContentDto>> getTemplate(@PathVariable String name) {
        TemplateContentDto template = templateService.getTemplate(name);
        return ResponseEntity.ok(ApiResponse.ok(template));
    }

    @PutMapping("/{name:.+}")
    public ResponseEntity<ApiResponse<TemplateContentDto>> updateTemplate(
            @PathVariable String name,
            @RequestBody UpdateTemplateRequest request) {
        TemplateContentDto updated = templateService.updateTemplate(name, request.content());
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }
}
