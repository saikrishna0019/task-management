package org.personal.taskmanagement.task.service;

import lombok.RequiredArgsConstructor;
import org.personal.taskmanagement.project.service.ProjectService;
import org.personal.taskmanagement.task.model.Task;
import org.personal.taskmanagement.task.repository.TaskRepository;
import org.personal.taskmanagement.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final UserService userService;

    @Transactional
    public Task createTask(Task task,  Long projectId, Long assigneeId, String emailId) {
        task.setProject(projectService.getProjectById(projectId));
        task.setCreator(userService.getUserByEmail(emailId));
        if (assigneeId != null) {
            task.setAssignee(userService.getUserById(assigneeId));
        }
        return taskRepository.save(task);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public List<Task> getTasksByAssignee(Long assigneeId) {
        return taskRepository.findByAssigneeId(assigneeId);
    }

    @Transactional
    public Task updateTask(Long id, Task taskDetails) {
        Task task = getTaskById(id);
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setPriority(taskDetails.getPriority());
        task.setDueDate(taskDetails.getDueDate());
        if (taskDetails.getAssignee() != null) {
            task.setAssignee(userService.getUserById(taskDetails.getAssignee().getId()));
        }
        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}