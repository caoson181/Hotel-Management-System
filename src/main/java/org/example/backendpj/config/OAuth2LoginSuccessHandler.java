package org.example.backendpj.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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

    public OAuth2LoginSuccessHandler(UserRepository userRepo) {
        this.userRepo = userRepo;
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

        if (user != null && user.getUsertype().equalsIgnoreCase("Customer")) {
            response.sendRedirect("/homepage");
        } else {
            response.sendRedirect("/index");
        }

    }
}