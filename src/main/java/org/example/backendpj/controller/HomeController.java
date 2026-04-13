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
import java.util.Comparator;
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
    public String gravityNews(Model model) {
        model.addAttribute("articles", buildNewsArticles());
        return "homepage/gravity-news";
    }

    @GetMapping("/gravity-news/{slug}")
    public String gravityNewsDetail(@PathVariable String slug, Model model) {
        List<Map<String, Object>> articles = buildNewsArticles();

        Map<String, Object> article = articles.stream()
                .filter(item -> slug.equals(item.get("slug")))
                .findFirst()
                .orElse(articles.get(0));

        List<Map<String, Object>> relatedArticles = articles.stream()
                .filter(item -> !item.get("slug").equals(article.get("slug")))
                .limit(3)
                .toList();

        model.addAttribute("article", article);
        model.addAttribute("relatedArticles", relatedArticles);
        return "homepage/gravity-news-detail";
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

    private List<Map<String, Object>> buildNewsArticles() {
        List<Map<String, Object>> articles = new ArrayList<>();

        articles.add(newsArticle(
                "luxury-hospitality-award-2025",
                "Gravity Hotel Earns Luxury Hospitality Award 2025",
                "Gravity Hotel has been recognized for its refined guest journey, curated design language, and service consistency across every touchpoint.",
                "achievement",
                "2025-06-12",
                "12 June 2025",
                "8 min read",
                "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
                "This article is part of the Gravity Hotel journal, where updates focus on hospitality design, guest experience, and property milestones.",
                List.of(
                        "An international hospitality review panel has named Gravity Hotel one of the year's most distinctive luxury stays, citing the property's calm atmosphere, attentive team, and thoughtful guest experience.",
                        "The award followed a six-month review covering guest satisfaction, design quality, sustainability practices, and service delivery.",
                        "Reviewers highlighted how the hotel balances a polished premium identity with a welcoming, human tone that still feels relaxed.",
                        "Leadership teams also received praise for building an operation that stays consistent across check-in, housekeeping, dining, and wellness services."
                ),
                List.of(
                        "Guest experience consistency was measured across arrival, in-stay support, dining, and departure touchpoints.",
                        "Judges specifically mentioned the hotel's quiet interior atmosphere, clean detailing, and staff responsiveness.",
                        "The recognition strengthens the brand's positioning for corporate retreats, leisure escapes, and premium family stays."
                ),
                "Gravity Hotel continues shaping a more immersive, design-led guest experience across rooms, wellness, and service touchpoints.",
                List.of(
                        "Expand staff training with new recognition-based service coaching.",
                        "Introduce a seasonal guest-experience program tied to wellness and dining.",
                        "Use the award campaign to deepen international media visibility."
                )
        ));

        articles.add(newsArticle(
                "new-skyline-suite-collection-officially-opens",
                "New Skyline Suite Collection Officially Opens",
                "A new suite collection introduces elevated interiors, panoramic city views, and a softer residential feel for long-stay guests.",
                "news",
                "2025-07-03",
                "03 July 2025",
                "6 min read",
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
                "The Skyline collection expands the hotel's premium inventory with room concepts designed for privacy, longer visits, and a stronger sense of place.",
                List.of(
                        "Gravity Hotel has officially launched its Skyline Suite Collection, a new category of premium accommodation designed around open layouts, textured materials, and expansive city-facing windows.",
                        "The suites combine lounge-style seating, flexible work surfaces, and layered lighting to support both business trips and slower leisure stays.",
                        "Design teams focused on a calmer residential feel, using warmer finishes and more generous circulation space than standard room layouts.",
                        "The collection is expected to become a key offer for executive travelers, couples celebrating milestone occasions, and guests booking multi-night premium experiences."
                ),
                List.of(
                        "Each suite includes a separate living corner and upgraded bath amenities.",
                        "Panoramic glazing was chosen to frame sunrise and evening skyline views.",
                        "The opening supports the property's strategy to diversify premium room options."
                ),
                "The new suite launch reflects a broader shift toward more flexible, experience-led accommodation at Gravity Hotel.",
                List.of(
                        "Package the suites with dining and airport transfer add-ons.",
                        "Feature the new room type across direct booking campaigns.",
                        "Collect early guest feedback to refine in-room amenities."
                )
        ));

        articles.add(newsArticle(
                "green-operations-milestone-2025",
                "Gravity Hotel Reaches Green Operations Milestone",
                "A fresh sustainability milestone recognizes measurable reductions in water waste, energy use, and disposable materials across hotel operations.",
                "achievement",
                "2025-05-20",
                "20 May 2025",
                "7 min read",
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
                "The update tracks operational improvements that align hospitality comfort with more responsible daily practices behind the scenes.",
                List.of(
                        "Gravity Hotel has reached a new green-operations milestone after completing a coordinated sustainability upgrade across housekeeping, laundry, lighting, and water management.",
                        "The program reduced unnecessary energy use in guest corridors and back-of-house zones while improving the monitoring of water-intensive service areas.",
                        "Procurement teams also shifted more amenities and packaging toward reusable or lower-waste alternatives without disrupting the guest experience.",
                        "Internal reporting shows the initiative improved operational efficiency while helping the hotel present a more credible long-term environmental commitment."
                ),
                List.of(
                        "Energy-saving controls were expanded in corridors, service stations, and selected guest floors.",
                        "Water monitoring now supports faster intervention when usage patterns spike unexpectedly.",
                        "Several disposable touchpoints were replaced with more durable alternatives."
                ),
                "The milestone shows how operational discipline can quietly improve both cost control and brand trust at the same time.",
                List.of(
                        "Publish a seasonal sustainability dashboard for guests and partners.",
                        "Continue supplier reviews for lower-waste amenities.",
                        "Integrate sustainability highlights into staff onboarding."
                )
        ));

        articles.add(newsArticle(
                "summer-chefs-table-weekend-announced",
                "Summer Chef's Table Weekend Announced for Guests",
                "A limited summer dining event will bring tasting menus, chef interaction, and curated beverage pairings to the hotel's signature restaurant.",
                "event",
                "2025-06-01",
                "01 June 2025",
                "5 min read",
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80",
                "Seasonal event coverage from Gravity Hotel highlights curated moments that bring guests together around food, culture, and atmosphere.",
                List.of(
                        "Gravity Hotel has announced a Summer Chef's Table Weekend that will transform its signature restaurant into an intimate tasting experience across two limited evenings.",
                        "The event will feature a multi-course menu built around coastal ingredients, contemporary presentation, and direct storytelling from the culinary team.",
                        "Guests can expect a more social dining format, with chef commentary between courses and pairing suggestions that match the seasonal menu.",
                        "The weekend is designed to appeal to residents planning a special night out as well as in-house guests looking for a memorable culinary highlight."
                ),
                List.of(
                        "Seating is intentionally limited to preserve an intimate and conversational atmosphere.",
                        "The tasting menu will spotlight seasonal ingredients and chef-led plating moments.",
                        "The event adds a stronger experiential layer to the hotel's dining calendar."
                ),
                "With special-format dining growing in demand, the Chef's Table weekend gives Gravity Hotel a more distinctive event identity.",
                List.of(
                        "Open early booking priority for in-house premium guests.",
                        "Promote the event through short-form social content and partner channels.",
                        "Evaluate demand for future chef-led seasonal dinners."
                )
        ));

        articles.add(newsArticle(
                "rooftop-infinity-pool-city-view",
                "Rooftop Infinity Pool Debuts with Panoramic City View",
                "Guests can now enjoy a new rooftop pool experience designed for skyline lounging, sunset moments, and light all-day refreshment service.",
                "news",
                "2025-06-25",
                "25 June 2025",
                "6 min read",
                "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80",
                "The rooftop pool story follows how new leisure amenities are expanding the hotel's appeal beyond overnight stays alone.",
                List.of(
                        "Gravity Hotel has introduced a rooftop infinity pool that pairs open skyline views with a quieter, resort-inspired atmosphere above the city.",
                        "The space combines shallow lounge zones, wider deck seating, and a compact poolside refreshment menu that encourages guests to stay longer throughout the day.",
                        "Architectural details were kept minimal and clean so the horizon remains the visual focus, especially during golden hour and evening light.",
                        "Management expects the rooftop to become one of the hotel's most photographed guest spaces and a key part of premium stay packages."
                ),
                List.of(
                        "The pool deck was designed for both active daytime use and softer sunset social moments.",
                        "A lighter food and beverage concept supports longer leisure visits without crowding the space.",
                        "The rooftop addition strengthens the hotel's lifestyle appeal for weekend stays."
                ),
                "The new amenity positions Gravity Hotel as a more experience-forward destination in the city staycation market.",
                List.of(
                        "Bundle rooftop access into selected suite and wellness offers.",
                        "Schedule sunset acoustic sessions during peak travel weekends.",
                        "Track guest demand to refine service staffing at high-traffic hours."
                )
        ));

        articles.add(newsArticle(
                "excellent-service-award-2025",
                "Gravity Hotel Receives Excellent Service Award 2025",
                "The property earned a service-focused distinction after strong guest feedback on responsiveness, warmth, and overall reliability.",
                "achievement",
                "2025-07-10",
                "10 July 2025",
                "7 min read",
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=80",
                "Service stories at Gravity Hotel focus on the people, standards, and operational habits that shape guest trust over time.",
                List.of(
                        "Gravity Hotel has received the Excellent Service Award 2025 after an external review consolidated guest feedback from digital travel platforms and post-stay surveys.",
                        "The distinction reflects consistent praise for fast support, friendly staff interactions, and a dependable experience across multiple departments.",
                        "Guests repeatedly referenced how service teams stayed attentive without being intrusive, especially during arrivals, dining, and late-evening requests.",
                        "Management noted that the recognition belongs not only to front-facing staff but also to housekeeping, engineering, and behind-the-scenes teams that keep service delivery smooth."
                ),
                List.of(
                        "Review data emphasized responsiveness, tone of communication, and issue resolution speed.",
                        "The award validates recent internal coaching and cross-department service standards.",
                        "Recognition can help reinforce trust among future direct-booking guests."
                ),
                "By investing in consistency instead of isolated premium gestures, Gravity Hotel continues to strengthen its reputation in a durable way.",
                List.of(
                        "Roll out recognition-based incentives for service teams.",
                        "Use recent feedback trends to sharpen arrival and concierge moments.",
                        "Turn award visibility into stronger loyalty messaging on direct channels."
                )
        ));

        articles.sort(Comparator.comparing((Map<String, Object> article) -> String.valueOf(article.get("date"))).reversed());
        return articles;
    }

    private Map<String, Object> newsArticle(String slug,
                                            String title,
                                            String excerpt,
                                            String category,
                                            String date,
                                            String dateDisplay,
                                            String readTime,
                                            String coverImage,
                                            String bodyImage,
                                            String snapshot,
                                            List<String> paragraphs,
                                            List<String> highlights,
                                            String bodyImageCaption,
                                            List<String> nextSteps) {
        Map<String, Object> article = new LinkedHashMap<>();
        article.put("slug", slug);
        article.put("title", title);
        article.put("excerpt", excerpt);
        article.put("category", category);
        article.put("date", date);
        article.put("dateDisplay", dateDisplay);
        article.put("readTime", readTime);
        article.put("coverImage", coverImage);
        article.put("heroImage", coverImage);
        article.put("bodyImage", bodyImage);
        article.put("snapshot", snapshot);
        article.put("paragraphs", paragraphs);
        article.put("highlights", highlights);
        article.put("bodyImageCaption", bodyImageCaption);
        article.put("nextSteps", nextSteps);
        return article;
    }
}
