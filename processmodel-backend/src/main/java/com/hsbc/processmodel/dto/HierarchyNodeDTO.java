package com.hsbc.processmodel.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HierarchyNodeDTO {
    private Long id;
    private String name;
    private String code;
    private String description;
    private String level;
    private Long parentId;
    private int childCount;
    private NodeMetrics metrics;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NodeMetrics {
        private long totalProcesses;
        private long newRequests;
        private long closedRequests;
        private long pendingEod;
        private double tatDays;
        private double attPercentage;
    }
}
