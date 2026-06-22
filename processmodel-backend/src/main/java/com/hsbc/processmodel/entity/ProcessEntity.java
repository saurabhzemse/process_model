package com.hsbc.processmodel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "processes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sub_business_process_id", nullable = false)
    private Long subBusinessProcessId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String code;

    private String description;

    @Column(name = "sla_days")
    private Integer slaDays;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
