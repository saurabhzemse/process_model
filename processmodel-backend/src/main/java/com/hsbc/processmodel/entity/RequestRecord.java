package com.hsbc.processmodel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "process_id", nullable = false)
    private Long processId;

    @Column(name = "market_id", nullable = false)
    private Long marketId;

    @Column(name = "reference_number", nullable = false, unique = true)
    private String referenceNumber;

    @Column(nullable = false)
    private String status;

    private String priority;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @Column(name = "assigned_to")
    private String assignedTo;

    @Column(name = "sla_breached")
    private Boolean slaBreached;

    private String notes;
}
