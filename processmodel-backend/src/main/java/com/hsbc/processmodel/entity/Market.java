package com.hsbc.processmodel.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "markets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Market {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    private String region;
    private String timezone;
}
