package org.example.backendpj.Service;

import org.springframework.scheduling.annotation.Async;
import org.example.backendpj.Entity.Contact;
import org.example.backendpj.Repository.ContactRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.*;

import java.util.*;

@Service
public class SentimentService {

    @Value("${huggingface.api.key}")
    private String apiKey;

    private final ContactRepository contactRepository;

    public SentimentService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public String analyze(String message) {
        try {
            System.out.println("===== CALLING AI =====");
            System.out.println("MESSAGE: " + message);

            RestTemplate restTemplate = new RestTemplate();

            String url = "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Accept", "application/json");
            headers.setBearerAuth(apiKey);
            headers.set("x-wait-for-model", "true");

            Map<String, String> body = new HashMap<>();
            body.put("inputs", message);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            String json = response.getBody();

            System.out.println("RAW JSON: " + json);

            ObjectMapper mapper = new ObjectMapper();

            // convert JSON → List
            List<List<Map<String, Object>>> result = mapper.readValue(json, List.class);

            List<Map<String, Object>> predictions = result.get(0);

            // tìm score cao nhất
            Map<String, Object> best = predictions.get(0);

            for (Map<String, Object> p : predictions) {
                double score = Double.parseDouble(p.get("score").toString());
                double bestScore = Double.parseDouble(best.get("score").toString());

                if (score > bestScore) {
                    best = p;
                }
            }

            String label = best.get("label").toString();

            System.out.println("BEST LABEL: " + label);

            // mapping
            if (label.equals("LABEL_2"))
                return "Positive";
            if (label.equals("LABEL_0"))
                return "Negative";
            return "Neutral";

        } catch (Exception e) {
            System.out.println("❌ ERROR AI:");
            e.printStackTrace(); // 👈 QUAN TRỌNG
            return "Neutral";
        }
    }

    @Async
    public void analyzeAsync(Contact contact) {
        try {
            String sentiment = analyze(contact.getMessage());

            contact.setSentiment(sentiment);

            contactRepository.save(contact); // 🔥 update DB

            System.out.println("✅ Async sentiment done: " + sentiment);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}