package org.example.backendpj.controller;

import org.example.backendpj.Entity.EquipmentStatus;
import org.example.backendpj.Service.EquipmentService;
import org.example.backendpj.dto.EquipmentCheckRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    // =========================
    // GET equipment
    // =========================
    @GetMapping("/{roomId}")
    public Map<String, List<Map<String, Object>>> getEquipment(@PathVariable Integer roomId) {
        return equipmentService.getEquipmentByRoom(roomId);
    }

    // =========================
    // POST save check
    // =========================
    @PostMapping("/check")
    public ResponseEntity<?> saveCheck(@RequestBody EquipmentCheckRequest request) {
        equipmentService.saveCheck(request);
        return ResponseEntity.ok("Saved successfully");
    }

    // =========================
    // Clean & Complete
    // =========================
    @PostMapping("/{roomId}/complete-clean")
    public ResponseEntity<?> completeClean(@PathVariable Integer roomId) {
        equipmentService.completeCleaning(roomId);
        return ResponseEntity.ok("Room cleaned & data cleared");
    }
    // DELETE data + mark room AVAILABLE
    @DeleteMapping("/{roomId}/complete")
    public ResponseEntity<?> completeCleaning(@PathVariable Integer roomId) {
        try {
            equipmentService.completeCleaning(roomId);
            return ResponseEntity.ok(Map.of("message", "Success"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // Get all missing equipment (for manager view)
    @GetMapping("/issues")
    public List<Map<String, Object>> getMissingIssues() {
        List<EquipmentStatus> missingList = equipmentService.getMissingEquipment();

        // Map to simple JSON for frontend
        List<Map<String, Object>> result = new ArrayList<>();
        for (EquipmentStatus status : missingList) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", status.getId());
            item.put("roomId", status.getRoomId());
            item.put("area", status.getArea());
            item.put("equipmentName", status.getEquipmentName());
            result.add(item);
        }
        return result;
    }

    // Resolve single issue
    @PostMapping("/issues/{id}/resolve")
    public ResponseEntity<?> resolveIssue(@PathVariable Integer id) {
        equipmentService.resolveIssue(id);
        return ResponseEntity.ok("Resolved");
    }
    @PostMapping("/resolve-specific")
    public ResponseEntity<?> resolveSpecific(
            @RequestParam Integer roomId,
            @RequestParam String area,
            @RequestParam String name) {
        try {
            equipmentService.resolveByDetails(roomId, area, name);
            return ResponseEntity.ok(Map.of("message", "Item resolved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
}