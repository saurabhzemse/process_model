package com.hsbc.processmodel.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetricsDTO {
    private Long nodeId;
    private String nodeName;
    private String nodeType;
    private long totalProcesses;
    private long newRequests;
    private long inProgressRequests;
    private long pendingRequests;
    private long closedRequests;
    private long rejectedRequests;
    private long pendingEod;
    private double tatDays;
    private double attPercentage;
    private List<BpBreakdown> businessProcessBreakdown;
    private List<MarketRanking> topMarkets;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BpBreakdown {
        private String name;
        private long newCount;
        private long closedCount;
        private long inProgressCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MarketRanking {
        private int rank;
        private String marketName;
        private String marketCode;
        private double slaAdherencePercentage;
        private long totalRequests;
        private long closedRequests;
    }
}
