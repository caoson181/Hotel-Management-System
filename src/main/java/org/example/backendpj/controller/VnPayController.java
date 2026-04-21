package org.example.backendpj.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.example.backendpj.Service.VnPayService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.Map;

@Controller
public class VnPayController {

    private final VnPayService vnPayService;

    public VnPayController(VnPayService vnPayService) {
        this.vnPayService = vnPayService;
    }

    @GetMapping("/api/vnpay/callback")
    public String handleCallback(@RequestParam Map<String, String> requestParams, HttpServletRequest request) {
        Map<String, String> params = new HashMap<>(requestParams);
        if (!params.containsKey("vnp_TxnRef")) {
            params.put("vnp_TxnRef", request.getParameter("vnp_TxnRef"));
        }
        Map<String, String> result = vnPayService.handleCallback(params);
        return "redirect:" + vnPayService.buildFrontendRedirectUrl(result);
    }
}
