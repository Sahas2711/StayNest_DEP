package com.mit.StayNest;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

@Component
public class DbVerifier {

    @Autowired
    private DataSource dataSource;

    @PostConstruct
    public void printDbUrl() throws Exception {
        System.out.println(
            "🔥 ACTUAL JDBC URL = " +
            dataSource.getConnection().getMetaData().getURL()
        );
    }
}
