package org.example.backendpj.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping({"/", "/homepage"})
    public String home() {
        return "homepage/homepage";
    }

    @GetMapping("/about")
    public String about() {
        return "homepage/about";
    }

    @GetMapping("/rooms")
    public String rooms() {
        return "homepage/rooms";
    }

    @GetMapping("/services")
    public String services() {
        return "homepage/services";
    }

    @GetMapping("/contact")
    public String contact() {
        return "homepage/contact";
    }
}