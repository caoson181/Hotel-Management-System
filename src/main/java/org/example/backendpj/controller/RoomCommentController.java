package org.example.backendpj.controller;

import org.example.backendpj.Service.RoomCommentService;
import org.example.backendpj.dto.RoomCommentRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/room-comments")
public class RoomCommentController {

    private final RoomCommentService roomCommentService;

    public RoomCommentController(RoomCommentService roomCommentService) {
        this.roomCommentService = roomCommentService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getReviews(@RequestParam String type,
                                                          @RequestParam String rank) {
        return ResponseEntity.ok(roomCommentService.getReviewSummary(type, rank));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createReview(@RequestBody RoomCommentRequest request,
                                                            Principal principal) {
        String login = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(roomCommentService.createReview(request, login));
    }
}
