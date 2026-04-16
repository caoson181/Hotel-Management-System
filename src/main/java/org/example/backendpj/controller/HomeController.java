package org.example.backendpj.controller;

import org.example.backendpj.Entity.Room;
import org.example.backendpj.Repository.RoomRepository;
import org.springframework.context.MessageSource;
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
import java.util.Locale;
import java.util.Map;


@Controller
public class HomeController {

    private final RoomRepository roomRepository;
    private final MessageSource messageSource;

    public HomeController(RoomRepository roomRepository, MessageSource messageSource) {
        this.roomRepository = roomRepository;
        this.messageSource = messageSource;
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
    public String services(Model model, Locale locale) {
        List<Map<String, Object>> services = buildServices(locale);
        model.addAttribute("services", services);
        return "homepage/services";
    }

    @GetMapping("/services/{slug}")
    public String serviceDetail(@PathVariable String slug, Model model, Locale locale) {
        List<Map<String, Object>> services = buildServices(locale);

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
    public String gravityNews(Model model, Locale locale) {
        model.addAttribute("articles", buildNewsArticles(locale));
        return "homepage/gravity-news";
    }

    @GetMapping("/gravity-news/{slug}")
    public String gravityNewsDetail(@PathVariable String slug, Model model, Locale locale) {
        List<Map<String, Object>> articles = buildNewsArticles(locale);

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

    private List<Map<String, Object>> buildServices(Locale locale) {
        List<Map<String, Object>> services = new ArrayList<>();

        services.add(service(
                "spa",
                message("service.spa.menu", locale),
                message("service.spa.title", locale),
                message("service.spa.eyebrow", locale),
                message("service.spa.description", locale),
                message("service.spa.highlight", locale),
                "/images/slide1.jpg",
                message("service.spa.hours", locale),
                message("service.spa.location", locale),
                List.of(
                        message("service.spa.paragraph1", locale),
                        message("service.spa.paragraph2", locale)
                ),
                List.of(
                        message("service.spa.feature1", locale),
                        message("service.spa.feature2", locale),
                        message("service.spa.feature3", locale)
                ),
                message("service.spa.footnote", locale),
                List.of(
                        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80"
                )
        ));

        services.add(service(
                "pool",
                message("service.pool.menu", locale),
                message("service.pool.title", locale),
                message("service.pool.eyebrow", locale),
                message("service.pool.description", locale),
                message("service.pool.highlight", locale),
                "/images/slide2.jpg",
                message("service.pool.hours", locale),
                message("service.pool.location", locale),
                List.of(
                        message("service.pool.paragraph1", locale),
                        message("service.pool.paragraph2", locale)
                ),
                List.of(
                        message("service.pool.feature1", locale),
                        message("service.pool.feature2", locale),
                        message("service.pool.feature3", locale)
                ),
                message("service.pool.footnote", locale),
                List.of(
                        "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
                )
        ));

        services.add(service(
                "gym",
                message("service.gym.menu", locale),
                message("service.gym.title", locale),
                message("service.gym.eyebrow", locale),
                message("service.gym.description", locale),
                message("service.gym.highlight", locale),
                "/images/slide6.jpg",
                message("service.gym.hours", locale),
                message("service.gym.location", locale),
                List.of(
                        message("service.gym.paragraph1", locale),
                        message("service.gym.paragraph2", locale)
                ),
                List.of(
                        message("service.gym.feature1", locale),
                        message("service.gym.feature2", locale),
                        message("service.gym.feature3", locale)
                ),
                message("service.gym.footnote", locale),
                List.of(
                        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
                )
        ));

        services.add(service(
                "restaurant",
                message("service.restaurant.menu", locale),
                message("service.restaurant.title", locale),
                message("service.restaurant.eyebrow", locale),
                message("service.restaurant.description", locale),
                message("service.restaurant.highlight", locale),
                "/images/slide4.jpg",
                message("service.restaurant.hours", locale),
                message("service.restaurant.location", locale),
                List.of(
                        message("service.restaurant.paragraph1", locale),
                        message("service.restaurant.paragraph2", locale)
                ),
                List.of(
                        message("service.restaurant.feature1", locale),
                        message("service.restaurant.feature2", locale),
                        message("service.restaurant.feature3", locale)
                ),
                message("service.restaurant.footnote", locale),
                List.of(
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80"
                )
        ));

        return services;
    }

    private String message(String key, Locale locale) {
        return messageSource.getMessage(key, null, locale);
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
        service.put("thumbnailImages", Arrays.asList(gallery.get(0), coverImage, gallery.get(1), gallery.get(2)));
        return service;
    }

    private List<Map<String, Object>> buildNewsArticles(Locale locale) {
        List<Map<String, Object>> articles = new ArrayList<>();

        articles.add(newsArticle(
                "luxury-hospitality-award-2025",
                message("news.luxury-hospitality-award-2025.title", locale),
                message("news.luxury-hospitality-award-2025.excerpt", locale),
                "achievement",
                "2025-06-12",
                message("news.luxury-hospitality-award-2025.dateDisplay", locale),
                message("news.luxury-hospitality-award-2025.readTime", locale),
                "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
                message("news.luxury-hospitality-award-2025.snapshot", locale),
                List.of(
                        message("news.luxury-hospitality-award-2025.paragraph1", locale),
                        message("news.luxury-hospitality-award-2025.paragraph2", locale),
                        message("news.luxury-hospitality-award-2025.paragraph3", locale),
                        message("news.luxury-hospitality-award-2025.paragraph4", locale)
                ),
                List.of(
                        message("news.luxury-hospitality-award-2025.highlight1", locale),
                        message("news.luxury-hospitality-award-2025.highlight2", locale),
                        message("news.luxury-hospitality-award-2025.highlight3", locale)
                ),
                message("news.luxury-hospitality-award-2025.bodyImageCaption", locale),
                List.of(
                        message("news.luxury-hospitality-award-2025.next1", locale),
                        message("news.luxury-hospitality-award-2025.next2", locale),
                        message("news.luxury-hospitality-award-2025.next3", locale)
                )
        ));

        articles.add(newsArticle(
                "new-skyline-suite-collection-officially-opens",
                message("news.new-skyline-suite-collection-officially-opens.title", locale),
                message("news.new-skyline-suite-collection-officially-opens.excerpt", locale),
                "news",
                "2025-07-03",
                message("news.new-skyline-suite-collection-officially-opens.dateDisplay", locale),
                message("news.new-skyline-suite-collection-officially-opens.readTime", locale),
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
                message("news.new-skyline-suite-collection-officially-opens.snapshot", locale),
                List.of(
                        message("news.new-skyline-suite-collection-officially-opens.paragraph1", locale),
                        message("news.new-skyline-suite-collection-officially-opens.paragraph2", locale),
                        message("news.new-skyline-suite-collection-officially-opens.paragraph3", locale),
                        message("news.new-skyline-suite-collection-officially-opens.paragraph4", locale)
                ),
                List.of(
                        message("news.new-skyline-suite-collection-officially-opens.highlight1", locale),
                        message("news.new-skyline-suite-collection-officially-opens.highlight2", locale),
                        message("news.new-skyline-suite-collection-officially-opens.highlight3", locale)
                ),
                message("news.new-skyline-suite-collection-officially-opens.bodyImageCaption", locale),
                List.of(
                        message("news.new-skyline-suite-collection-officially-opens.next1", locale),
                        message("news.new-skyline-suite-collection-officially-opens.next2", locale),
                        message("news.new-skyline-suite-collection-officially-opens.next3", locale)
                )
        ));

        articles.add(newsArticle(
                "green-operations-milestone-2025",
                message("news.green-operations-milestone-2025.title", locale),
                message("news.green-operations-milestone-2025.excerpt", locale),
                "achievement",
                "2025-05-20",
                message("news.green-operations-milestone-2025.dateDisplay", locale),
                message("news.green-operations-milestone-2025.readTime", locale),
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
                message("news.green-operations-milestone-2025.snapshot", locale),
                List.of(
                        message("news.green-operations-milestone-2025.paragraph1", locale),
                        message("news.green-operations-milestone-2025.paragraph2", locale),
                        message("news.green-operations-milestone-2025.paragraph3", locale),
                        message("news.green-operations-milestone-2025.paragraph4", locale)
                ),
                List.of(
                        message("news.green-operations-milestone-2025.highlight1", locale),
                        message("news.green-operations-milestone-2025.highlight2", locale),
                        message("news.green-operations-milestone-2025.highlight3", locale)
                ),
                message("news.green-operations-milestone-2025.bodyImageCaption", locale),
                List.of(
                        message("news.green-operations-milestone-2025.next1", locale),
                        message("news.green-operations-milestone-2025.next2", locale),
                        message("news.green-operations-milestone-2025.next3", locale)
                )
        ));

        articles.add(newsArticle(
                "summer-chefs-table-weekend-announced",
                message("news.summer-chefs-table-weekend-announced.title", locale),
                message("news.summer-chefs-table-weekend-announced.excerpt", locale),
                "event",
                "2025-06-01",
                message("news.summer-chefs-table-weekend-announced.dateDisplay", locale),
                message("news.summer-chefs-table-weekend-announced.readTime", locale),
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80",
                message("news.summer-chefs-table-weekend-announced.snapshot", locale),
                List.of(
                        message("news.summer-chefs-table-weekend-announced.paragraph1", locale),
                        message("news.summer-chefs-table-weekend-announced.paragraph2", locale),
                        message("news.summer-chefs-table-weekend-announced.paragraph3", locale),
                        message("news.summer-chefs-table-weekend-announced.paragraph4", locale)
                ),
                List.of(
                        message("news.summer-chefs-table-weekend-announced.highlight1", locale),
                        message("news.summer-chefs-table-weekend-announced.highlight2", locale),
                        message("news.summer-chefs-table-weekend-announced.highlight3", locale)
                ),
                message("news.summer-chefs-table-weekend-announced.bodyImageCaption", locale),
                List.of(
                        message("news.summer-chefs-table-weekend-announced.next1", locale),
                        message("news.summer-chefs-table-weekend-announced.next2", locale),
                        message("news.summer-chefs-table-weekend-announced.next3", locale)
                )
        ));

        articles.add(newsArticle(
                "rooftop-infinity-pool-city-view",
                message("news.rooftop-infinity-pool-city-view.title", locale),
                message("news.rooftop-infinity-pool-city-view.excerpt", locale),
                "news",
                "2025-06-25",
                message("news.rooftop-infinity-pool-city-view.dateDisplay", locale),
                message("news.rooftop-infinity-pool-city-view.readTime", locale),
                "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80",
                message("news.rooftop-infinity-pool-city-view.snapshot", locale),
                List.of(
                        message("news.rooftop-infinity-pool-city-view.paragraph1", locale),
                        message("news.rooftop-infinity-pool-city-view.paragraph2", locale),
                        message("news.rooftop-infinity-pool-city-view.paragraph3", locale),
                        message("news.rooftop-infinity-pool-city-view.paragraph4", locale)
                ),
                List.of(
                        message("news.rooftop-infinity-pool-city-view.highlight1", locale),
                        message("news.rooftop-infinity-pool-city-view.highlight2", locale),
                        message("news.rooftop-infinity-pool-city-view.highlight3", locale)
                ),
                message("news.rooftop-infinity-pool-city-view.bodyImageCaption", locale),
                List.of(
                        message("news.rooftop-infinity-pool-city-view.next1", locale),
                        message("news.rooftop-infinity-pool-city-view.next2", locale),
                        message("news.rooftop-infinity-pool-city-view.next3", locale)
                )
        ));

        articles.add(newsArticle(
                "excellent-service-award-2025",
                message("news.excellent-service-award-2025.title", locale),
                message("news.excellent-service-award-2025.excerpt", locale),
                "achievement",
                "2025-07-10",
                message("news.excellent-service-award-2025.dateDisplay", locale),
                message("news.excellent-service-award-2025.readTime", locale),
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=80",
                message("news.excellent-service-award-2025.snapshot", locale),
                List.of(
                        message("news.excellent-service-award-2025.paragraph1", locale),
                        message("news.excellent-service-award-2025.paragraph2", locale),
                        message("news.excellent-service-award-2025.paragraph3", locale),
                        message("news.excellent-service-award-2025.paragraph4", locale)
                ),
                List.of(
                        message("news.excellent-service-award-2025.highlight1", locale),
                        message("news.excellent-service-award-2025.highlight2", locale),
                        message("news.excellent-service-award-2025.highlight3", locale)
                ),
                message("news.excellent-service-award-2025.bodyImageCaption", locale),
                List.of(
                        message("news.excellent-service-award-2025.next1", locale),
                        message("news.excellent-service-award-2025.next2", locale),
                        message("news.excellent-service-award-2025.next3", locale)
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
