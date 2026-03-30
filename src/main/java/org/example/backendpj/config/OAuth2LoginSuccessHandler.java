package org.example.backendpj.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.example.backendpj.Entity.Customer;
import org.example.backendpj.Repository.CustomerRepository;
import org.example.backendpj.Repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepo;
    private final CustomerRepository customerRepo;

    public OAuth2LoginSuccessHandler(UserRepository userRepo, CustomerRepository customerRepo) {
        this.userRepo = userRepo;
        this.customerRepo = customerRepo;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");


        if (email == null) {
            response.sendRedirect("/auth/login?error=noemail");
            return;
        }

        if (!userRepo.existsByEmail(email)) {

            String redirectUrl = "/auth/signup?email="
                    + URLEncoder.encode(email, StandardCharsets.UTF_8)
                    + "&username="
                    + URLEncoder.encode(email.split("@")[0], StandardCharsets.UTF_8)
                    + "&name="
                    + URLEncoder.encode(name, StandardCharsets.UTF_8);

            response.sendRedirect(redirectUrl);
            return;
        }
        var user = userRepo.findByEmail(email).orElse(null);
        if (user != null) {

            // ✅ CHECK nếu chưa có Customer thì tạo
            if (user.getCustomer() == null) {
                Customer customer = new Customer();
                customer.setUser(user);
                customerRepo.save(customer);
            }

            if (user != null && user.getRole().equalsIgnoreCase("Customer")) {
                response.sendRedirect("/homepage");
            } else {
                response.sendRedirect("/index");
            }

        }
    }
}