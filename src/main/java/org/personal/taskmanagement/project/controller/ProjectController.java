package org.personal.taskmanagement.project.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.personal.taskmanagement.project.model.Project;
import org.personal.taskmanagement.project.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<Project> createProject(
            @Valid @RequestBody Project project,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.createProject(project, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @GetMapping("/owner/{id}")
    public ResponseEntity<List<Project>> getProjectByOwnerId(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectByOwnerId(id));
    }



    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody Project project) {
        return ResponseEntity.ok(projectService.updateProject(id, project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok().build();
    }
}