package org.example.backendpj.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.example.backendpj.Service.CustomOAuth2UserService;
@Configuration
public class SecurityConfig {
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService,
                          OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler) {
        this.customOAuth2UserService = customOAuth2UserService;
        this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
    }


     @Bean
     public PasswordEncoder passwordEncoder() {
         return org.springframework.security.crypto.password.NoOpPasswordEncoder.getInstance();
     }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/index",
                                "/about",
                                "/rooms",
                                "/services",
                                "/contact",
                                "/homepage",
                                "/about",
                                "/login",

                                "/auth/**",
                                "/oauth2/**",
                                "/login/oauth2/**",

                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/components/**",
                                "/*.html"
                        ).permitAll()

                        .anyRequest().authenticated()
                )

                .formLogin(form -> form
                        .loginPage("/auth/login")
                        .loginProcessingUrl("/login")
                        .successHandler((request, response, authentication) -> {

                            boolean isCustomer = authentication.getAuthorities()
                                    .stream()
                                    .anyMatch(a -> a.getAuthority().equalsIgnoreCase("ROLE_CUSTOMER")
                                            || a.getAuthority().equalsIgnoreCase("Customer"));

                            if (isCustomer) {
                                response.sendRedirect("/homepage");
                            } else {
                                response.sendRedirect("/index");
                            }

                        })
                        .failureUrl("/auth/login?error=true")
                        .permitAll()
                )
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                        )
                        .successHandler(oAuth2LoginSuccessHandler)
                )

                .logout(logout -> logout
                        .logoutSuccessUrl("/auth/login")
                );

        return http.build();
    }
}