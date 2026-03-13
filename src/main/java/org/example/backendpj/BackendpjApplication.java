package org.example.backendpj;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
@SpringBootApplication
@EntityScan("org.example.backendpj.Entity")
public class BackendpjApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendpjApplication.class, args);

    }

}
