package com.hsbc.processmodel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sub_business_processes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubBusinessProcess {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "business_process_id", nullable = false)
    private Long businessProcessId;

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
