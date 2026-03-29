package org.example.backendpj.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;
import org.example.backendpj.Entity.Room;
import org.example.backendpj.Repository.RoomRepository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;


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

        model.addAttribute("rank", rank);
        model.addAttribute("type", type);

        return "homepage/room-detail";
    }



    @GetMapping("/services")
    public String services() {
        return "homepage/services";
    }

    @GetMapping("/gravity-news")
    public String gravityNews() {
        return "homepage/gravity-news";
    }

    @GetMapping("/contact")
    public String contact() {
        return "homepage/contact";
    }
}
