package org.example.backendpj.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;

public class VNPayReturnController {
    @GetMapping("/payment-return")
    public String paymentReturn(HttpServletRequest request) {

        String responseCode = request.getParameter("vnp_ResponseCode");

        if ("00".equals(responseCode)) {
            return "payment-success";
        } else {
            return "payment-fail";
        }
    }
}
