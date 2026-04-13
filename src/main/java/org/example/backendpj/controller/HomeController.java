package org.example.backendpj.controller;

import org.example.backendpj.Entity.Room;
import org.example.backendpj.Repository.RoomRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


@Controller
public class HomeController {

    private final RoomRepository roomRepository;

    public HomeController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @GetMapping({"/", "/homepage"})
    public String home() {
        return "homepage/homepage";
    }

    @GetMapping("/about")
    public String about() {
        return "homepage/about";
    }

    @GetMapping("/rooms")
    public String rooms(Model model) {

        List<Room> rooms = roomRepository.findAll();

        model.addAttribute("rooms", rooms);

        return "homepage/rooms";
    }

    @GetMapping("/room-detail")
    public String roomDetail(@RequestParam String rank,
                             @RequestParam String type,
                             Model model) {
        Room room = roomRepository.findFirstByRoomTypeIgnoreCaseAndRoomRankIgnoreCaseOrderByIdAsc(type, rank);

        model.addAttribute("rank", rank);
        model.addAttribute("type", type);
        model.addAttribute("room", room);

        return "homepage/room-detail";
    }



    @GetMapping("/services")
    public String services(Model model) {
        List<Map<String, Object>> services = buildServices();
        model.addAttribute("services", services);
        return "homepage/services";
    }

    @GetMapping("/services/{slug}")
    public String serviceDetail(@PathVariable String slug, Model model) {
        List<Map<String, Object>> services = buildServices();

        Map<String, Object> currentService = services.stream()
                .filter(service -> slug.equals(service.get("slug")))
                .findFirst()
                .orElse(services.get(0));

        List<Map<String, Object>> relatedServices = services.stream()
                .filter(service -> !service.get("slug").equals(currentService.get("slug")))
                .toList();

        model.addAttribute("services", services);
        model.addAttribute("service", currentService);
        model.addAttribute("relatedServices", relatedServices);
        return "homepage/service-detail";
    }

    @GetMapping("/gravity-news")
    public String gravityNews() {
        return "homepage/gravity-news";
    }

    @GetMapping("/contact")
    public String contact() {
        return "homepage/contact";
    }

    private List<Map<String, Object>> buildServices() {
        List<Map<String, Object>> services = new ArrayList<>();

        services.add(service(
                "spa",
                "Spa",
                "Luxury Spa & Wellness",
                "Wellness Ritual",
                "Restore your balance with signature massages, herbal rituals, facial treatments, and a private wellness lounge designed for calm, comfort, and deep relaxation.",
                "An elegant retreat for guests who want a slower, more restorative stay.",
                "/images/slide1.jpg",
                "08:00 - 22:00 daily",
                "Level 2, Wellness Wing",
                List.of(
                        "Our spa experience blends modern comfort with a peaceful atmosphere for guests seeking recovery, calm, and quiet time away from the pace of travel. Signature therapies, herbal compress rituals, facial care, and private relaxation areas are arranged to make each visit feel unhurried and premium.",
                        "From solo recovery sessions to couples treatments, every appointment is designed around soft lighting, gentle aromas, and attentive service. The setting works equally well for post-flight relaxation, weekend wellness routines, or a restorative evening after a full day in the city."
                ),
                List.of(
                        "Private treatment suites",
                        "Signature massage therapies, facial care, and herbal rituals",
                        "Relaxation lounge with tea service before and after treatment"
                ),
                "Advance reservation is recommended for couples therapy, hot stone sessions, and peak evening hours.",
                List.of(
                        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80"
                )
        ));

        services.add(service(
                "pool",
                "Pool",
                "Swimming Pool",
                "Leisure Escape",
                "Enjoy a refreshing swim in a bright pool environment with sun loungers, calm water, and a resort-like atmosphere that works for both active mornings and relaxed afternoons.",
                "Perfect for a quiet dip, poolside reading, or family leisure time.",
                "/images/slide2.jpg",
                "06:00 - 21:00 daily",
                "Garden Deck, Ground Floor",
                List.of(
                        "The swimming pool is designed as an open-air retreat where guests can move between light exercise and slow leisure throughout the day. A clear waterline, wide deck, and comfortable seating create an easy rhythm for morning laps, midday breaks, or a calm sunset swim.",
                        "Poolside service keeps the space convenient for longer stays, while surrounding greenery softens the atmosphere and gives the area a more private resort character. It is an ideal choice for guests who want both movement and relaxation without leaving the hotel grounds."
                ),
                List.of(
                        "Temperature-controlled water",
                        "Relaxing poolside lounge chairs",
                        "Poolside towels and light refreshment service"
                ),
                "Children should be accompanied during busy hours, and guests are encouraged to arrive earlier for the quietest morning experience.",
                List.of(
                        "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
                )
        ));

        services.add(service(
                "gym",
                "Fitness",
                "Fitness Center",
                "Active Stay",
                "Train with modern cardio machines, free weights, strength equipment, and a well-lit workout floor created to support both quick routines and structured exercise sessions.",
                "A practical, polished space that keeps guests active during their stay.",
                "/images/slide6.jpg",
                "24/7 access",
                "Level 3, Sports Wing",
                List.of(
                        "The fitness center combines essential strength and cardio equipment in a clean, well-organized environment that supports both short workouts and full training sessions. Whether guests prefer treadmill intervals, resistance training, or a simple mobility routine, the space remains functional and comfortable throughout the day.",
                        "Large windows, mirrored walls, and a balanced equipment layout help the room feel open rather than crowded. It is especially suited for business travelers and long-stay guests who want a dependable place to maintain daily exercise habits without interruption."
                ),
                List.of(
                        "Modern cardio and resistance equipment",
                        "Spacious workout area with natural light",
                        "Open-access layout for quick solo routines any time"
                ),
                "For the most open floor space, early mornings and mid-afternoons are typically the quietest training periods.",
                List.of(
                        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
                )
        ));

        services.add(service(
                "restaurant",
                "Restaurant",
                "Fine Dining Restaurant",
                "Dining Experience",
                "Discover a curated menu of Vietnamese favorites and international classics served in an intimate dining room with attentive service, refined presentation, and a warm evening ambiance.",
                "Ideal for breakfast meetings, romantic dinners, or small celebrations.",
                "/images/slide4.jpg",
                "06:30 - 22:30 daily",
                "Lobby Level, Main Dining Hall",
                List.of(
                        "Our restaurant presents a dining experience built around polished service, balanced menus, and a setting that feels inviting from morning to late evening. Guests can enjoy a relaxed breakfast, a business lunch, or a more intimate dinner with dishes that combine familiar comfort and refined presentation.",
                        "Seasonal ingredients, chef-led specials, and a carefully arranged dining room help the space suit many occasions without feeling overly formal. The atmosphere is ideal for couples, small groups, and travelers who want a memorable meal close to their room."
                ),
                List.of(
                        "International and local cuisine",
                        "Chef-curated signature dishes",
                        "Private dining available on request"
                ),
                "Dinner reservations are recommended on weekends, especially for window seating and private dining requests.",
                List.of(
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80"
                )
        ));

        return services;
    }

    private Map<String, Object> service(String slug,
                                        String menuLabel,
                                        String title,
                                        String eyebrow,
                                        String description,
                                        String highlight,
                                        String coverImage,
                                        String openingHours,
                                        String location,
                                        List<String> detailParagraphs,
                                        List<String> features,
                                        String footnote,
                                        List<String> gallery) {
        Map<String, Object> service = new LinkedHashMap<>();
        service.put("slug", slug);
        service.put("menuLabel", menuLabel);
        service.put("title", title);
        service.put("eyebrow", eyebrow);
        service.put("description", description);
        service.put("highlight", highlight);
        service.put("coverImage", coverImage);
        service.put("openingHours", openingHours);
        service.put("location", location);
        service.put("detailParagraphs", detailParagraphs);
        service.put("features", features);
        service.put("footnote", footnote);
        service.put("gallery", gallery);
        service.put("heroImage", gallery.get(0));
        service.put("thumbnailImages", Arrays.asList(coverImage, gallery.get(1), gallery.get(2)));
        return service;
    }
}
