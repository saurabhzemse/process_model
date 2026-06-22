package com.hsbc.processmodel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "journeys")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Journey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    private String description;
    private String icon;

    @Column(name = "lob")
    private String lob;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
