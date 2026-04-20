package org.example.backendpj.controller;

import org.example.backendpj.Entity.StaffTask;
import org.example.backendpj.Service.StaffTaskService;
import org.example.backendpj.dto.StaffTaskForm;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/staff/tasks")
public class StaffTaskController {

    private final StaffTaskService staffTaskService;

    public StaffTaskController(StaffTaskService staffTaskService) {
        this.staffTaskService = staffTaskService;
    }

    @GetMapping("/manage")
    public String manageTasks(@RequestParam(required = false) String status,
                              @RequestParam(required = false) String type,
                              @RequestParam(required = false) Integer assignedUserId,
                              Model model) {
        List<StaffTask> tasks = staffTaskService.getAllTasks(status, type, assignedUserId);
        model.addAttribute("taskForm", new StaffTaskForm());
        model.addAttribute("tasks", tasks);
        model.addAttribute("summary", staffTaskService.summarize(tasks));
        model.addAttribute("assignableUsers", staffTaskService.getAssignableUsers());
        model.addAttribute("rooms", staffTaskService.getRooms());
        model.addAttribute("selectedStatus", status == null ? "" : status);
        model.addAttribute("selectedType", type == null ? "" : type);
        model.addAttribute("selectedAssignedUserId", assignedUserId);
        return "pages/staff/manage-tasks";
    }

    @GetMapping("/my")
    public String myTasks(Model model, Principal principal) {
        List<StaffTask> tasks = staffTaskService.getTasksForUser(principal.getName());
        model.addAttribute("tasks", tasks);
        model.addAttribute("summary", staffTaskService.summarize(tasks));
        return "pages/staff/my-tasks";
    }

    @PostMapping("/create")
    public String createTask(StaffTaskForm taskForm,
                             Principal principal,
                             RedirectAttributes redirectAttributes) {
        try {
            staffTaskService.createTask(taskForm, principal.getName());
            redirectAttributes.addFlashAttribute("success", "Task assigned successfully.");
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/staff/tasks/manage";
    }

    @PostMapping("/{id}/status")
    public String updateStatus(@PathVariable Integer id,
                               @RequestParam String status,
                               @RequestParam(required = false) String note,
                               @RequestParam(defaultValue = "my") String returnTo,
                               Principal principal,
                               RedirectAttributes redirectAttributes) {
        try {
            staffTaskService.updateTaskStatus(id, status, note, principal.getName());
            redirectAttributes.addFlashAttribute("success", "Task status updated.");
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
        }
        return "manage".equalsIgnoreCase(returnTo)
                ? "redirect:/staff/tasks/manage"
                : "redirect:/staff/tasks/my";
    }
}
