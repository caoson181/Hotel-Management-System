package org.example.backendpj.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;

@RestController
public class DbTestController {

    private final DataSource dataSource;

    public DbTestController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/api/db-test")
    public String test() throws Exception {
        try (Connection c = dataSource.getConnection()) {
            return "OK: " + c.getMetaData().getURL();
        }
    }
}