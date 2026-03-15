package org.example.backendpj.Service;

import org.springframework.stereotype.Service;
import org.example.backendpj.Repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepo;

    public CustomOAuth2UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {

        return super.loadUser(request);

    }
}