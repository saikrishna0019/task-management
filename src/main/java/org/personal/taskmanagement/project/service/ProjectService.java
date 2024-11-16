package org.personal.taskmanagement.project.service;

import lombok.RequiredArgsConstructor;
import org.personal.taskmanagement.project.model.Project;
import org.personal.taskmanagement.project.repository.ProjectRepository;
import org.personal.taskmanagement.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserService userService;

    @Transactional
    public Project createProject(Project project, String emailId) {
        project.setOwner(userService.getUserByEmail(emailId));
        return projectRepository.save(project);
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public List<Project> getProjectByOwnerId(Long ownerId) {
        return projectRepository.findByOwnerId(ownerId);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Transactional
    public Project updateProject(Long id, Project projectDetails) {
        Project project = getProjectById(id);
        project.setName(projectDetails.getName());
        project.setDescription(projectDetails.getDescription());
        project.setDeadline(projectDetails.getDeadline());
        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}