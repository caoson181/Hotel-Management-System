package org.example.backendpj.Service;

import org.example.backendpj.Entity.RoomComment;
import org.example.backendpj.Entity.User;
import org.example.backendpj.Entity.UserAvatar;
import org.example.backendpj.Repository.RoomCommentRepository;
import org.example.backendpj.Repository.UserAvatarRepository;
import org.example.backendpj.Repository.UserRepository;
import org.example.backendpj.dto.RoomCommentRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class RoomCommentService {

    private static final DateTimeFormatter REVIEW_TIME_FORMAT =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final RoomCommentRepository roomCommentRepository;
    private final UserRepository userRepository;
    private final UserAvatarRepository userAvatarRepository;

    public RoomCommentService(RoomCommentRepository roomCommentRepository,
                              UserRepository userRepository,
                              UserAvatarRepository userAvatarRepository) {
        this.roomCommentRepository = roomCommentRepository;
        this.userRepository = userRepository;
        this.userAvatarRepository = userAvatarRepository;
    }

    public Map<String, Object> getReviewSummary(String roomType, String roomRank) {
        List<RoomComment> comments = roomCommentRepository
                .findByRoomTypeIgnoreCaseAndRoomRankIgnoreCaseOrderByCreatedAtDesc(roomType, roomRank);

        Map<Integer, Long> ratingCounts = new LinkedHashMap<>();
        for (int rating = 5; rating >= 1; rating--) {
            ratingCounts.put(rating, 0L);
        }

        double average = 0.0;
        if (!comments.isEmpty()) {
            int total = 0;
            for (RoomComment comment : comments) {
                int rating = normalizeRating(comment.getRating());
                total += rating;
                ratingCounts.put(rating, ratingCounts.getOrDefault(rating, 0L) + 1);
            }
            average = BigDecimal.valueOf((double) total / comments.size())
                    .setScale(1, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        List<Map<String, Object>> reviewItems = new ArrayList<>();
        for (RoomComment comment : comments) {
            User user = comment.getUser();
            UserAvatar avatar = user != null
                    ? userAvatarRepository.findByUser_IdAndIsCurrentTrue(user.getId()).orElse(null)
                    : null;

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", comment.getCommentId());
            item.put("content", comment.getContent());
            item.put("rating", normalizeRating(comment.getRating()));
            item.put("createdAt", comment.getCreatedAt());
            item.put("createdAtText", comment.getCreatedAt() == null ? "" : comment.getCreatedAt().format(REVIEW_TIME_FORMAT));
            item.put("authorName", user != null && user.getFullName() != null && !user.getFullName().isBlank()
                    ? user.getFullName()
                    : "Guest");
            item.put("authorInitial", buildInitial(user != null ? user.getFullName() : null));
            item.put("avatarUrl", avatar != null ? avatar.getUrl() : null);
            reviewItems.add(item);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("roomType", roomType == null ? "" : roomType.toLowerCase(Locale.ROOT));
        response.put("roomRank", roomRank == null ? "" : roomRank.toLowerCase(Locale.ROOT));
        response.put("averageRating", average);
        response.put("totalReviews", comments.size());
        response.put("ratingCounts", ratingCounts);
        response.put("reviews", reviewItems);
        return response;
    }

    public Map<String, Object> createReview(RoomCommentRequest request, String login) {
        if (login == null || login.isBlank()) {
            throw new RuntimeException("You must be logged in to review this room.");
        }

        User user = userRepository.findByUsernameOrEmail(login, login)
                .orElseThrow(() -> new RuntimeException("User not found."));

        String roomType = safeValue(request.getRoomType());
        String roomRank = safeValue(request.getRoomRank());
        String content = safeValue(request.getContent());
        Integer rating = request.getRating();

        if (roomType.isBlank() || roomRank.isBlank()) {
            throw new RuntimeException("Room type and room rank are required.");
        }
        if (content.isBlank()) {
            throw new RuntimeException("Review content cannot be empty.");
        }
        if (content.length() > 2000) {
            throw new RuntimeException("Review content cannot exceed 2000 characters.");
        }
        if (rating == null || rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5.");
        }

        RoomComment roomComment = new RoomComment();
        roomComment.setRoomType(roomType.toLowerCase(Locale.ROOT));
        roomComment.setRoomRank(roomRank.toLowerCase(Locale.ROOT));
        roomComment.setContent(content);
        roomComment.setRating(rating);
        roomComment.setCreatedAt(LocalDateTime.now());
        roomComment.setUser(user);
        roomCommentRepository.save(roomComment);

        return getReviewSummary(roomType, roomRank);
    }

    private int normalizeRating(Integer rating) {
        if (rating == null) {
            return 0;
        }
        return Math.max(1, Math.min(5, rating));
    }

    private String safeValue(String value) {
        return value == null ? "" : value.trim();
    }

    private String buildInitial(String fullName) {
        if (fullName == null || fullName.isBlank()) {
            return "G";
        }
        return fullName.substring(0, 1).toUpperCase(Locale.ROOT);
    }
}
