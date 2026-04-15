package org.example.backendpj.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.example.backendpj.Service.CustomOAuth2UserService;
import org.example.backendpj.Service.CustomerTierService;
import org.example.backendpj.Service.UserService;
@Configuration
public class SecurityConfig {
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final UserService userService;
    private final CustomerTierService customerTierService;

    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService,
                          OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler,
                          UserService userService,
                          CustomerTierService customerTierService) {
        this.customOAuth2UserService = customOAuth2UserService;
        this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
        this.userService = userService;
        this.customerTierService = customerTierService;
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
                                "/about",
                                "/gravity-news",
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
                                "/*.html",
                                "/api/rooms/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/room-comments/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/room-comments/**")
                        .hasAnyAuthority("ROLE_CUSTOMER", "Customer", "ROLE_Customer")
                        // Customer booking flow
                        .requestMatchers("/api/customer-bookings/checkout")
                        .hasAnyAuthority("ROLE_CUSTOMER", "Customer", "ROLE_Customer")
                        .requestMatchers(HttpMethod.POST, "/api/customer-bookings/*/cancel")
                        .hasAnyAuthority("ROLE_CUSTOMER", "Customer", "ROLE_Customer")
                        .requestMatchers(HttpMethod.POST,
                                "/api/customer-bookings/details/*/cancel",
                                "/api/customer-bookings/pending/*/cancel")
                        .hasAnyAuthority("ROLE_CUSTOMER", "Customer", "ROLE_Customer")
                        .requestMatchers("/api/customer-bookings/**")
                        .hasAnyAuthority(
                                "ROLE_ADMIN", "ROLE_MANAGER", "ROLE_RECEPTIONIST", "ROLE_HOUSEKEEPER",
                                "Admin", "Manager", "Receptionist", "Housekeeper"
                        )
                        // Staff VIEW (all staff roles)
                        .requestMatchers("/staff/view/**")
                        .hasAnyRole("ADMIN", "MANAGER", "RECEPTIONIST", "HOUSEKEEPER")

                        // Staff MANAGE (only Admin & Manager)
                        .requestMatchers("/staff/manage/**",
                                "/staff/add",
                                "/staff/edit/**",
                                "/staff/delete/**")
                        .hasAnyRole("ADMIN", "MANAGER")

                        // Staff dashboard
                        .requestMatchers("/index", "/index/**")
                        .hasAnyRole("ADMIN", "MANAGER", "RECEPTIONIST", "HOUSEKEEPER")
                        // Only Admin & Manager can access
                        .requestMatchers("/rooms/view-room-status/**")
                        .hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers("/users/manage/**")
                        .hasAnyRole("ADMIN", "MANAGER")
                        // Admin only
                        .requestMatchers("/revenue/**")
                        .hasAnyRole("ADMIN","MANAGER")
                        .requestMatchers("/reports/**")
                        .hasAnyRole("ADMIN","MANAGER")


                        // Everything else

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
                                var user = userService.findByUsernameOrEmail(authentication.getName());
                                customerTierService.refreshTierForUser(user);
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
