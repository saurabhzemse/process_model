package com.hsbc.processmodel.service;

import com.hsbc.processmodel.dto.MetricsDTO;
import com.hsbc.processmodel.entity.*;
import com.hsbc.processmodel.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MetricsService {

    private final HierarchyService hierarchyService;
    private final BusinessProcessRepository businessProcessRepository;
    private final SubBusinessProcessRepository subBusinessProcessRepository;
    private final ProcessEntityRepository processEntityRepository;
    private final RequestRecordRepository requestRecordRepository;
    private final MarketRepository marketRepository;
    private final JourneyRepository journeyRepository;

    public MetricsDTO getMetrics(String nodeType, Long nodeId) {
        List<Long> processIds;
        String nodeName;

        switch (nodeType) {
            case "JOURNEY" -> {
                processIds = hierarchyService.getProcessIdsForJourney(nodeId);
                nodeName = journeyRepository.findById(nodeId).map(Journey::getName).orElse("Unknown");
            }
            case "BUSINESS_PROCESS" -> {
                processIds = hierarchyService.getProcessIdsForBusinessProcess(nodeId);
                nodeName = businessProcessRepository.findById(nodeId).map(BusinessProcess::getName).orElse("Unknown");
            }
            case "SUB_BUSINESS_PROCESS" -> {
                processIds = hierarchyService.getProcessIdsForSubProcess(nodeId);
                nodeName = subBusinessProcessRepository.findById(nodeId).map(SubBusinessProcess::getName).orElse("Unknown");
            }
            case "PROCESS" -> {
                processIds = List.of(nodeId);
                nodeName = processEntityRepository.findById(nodeId).map(ProcessEntity::getName).orElse("Unknown");
            }
            default -> throw new IllegalArgumentException("Unknown nodeType: " + nodeType);
        }

        if (processIds.isEmpty()) {
            return MetricsDTO.builder()
                    .nodeId(nodeId).nodeName(nodeName).nodeType(nodeType)
                    .businessProcessBreakdown(List.of()).topMarkets(List.of()).build();
        }

        long newReqs = requestRecordRepository.countByProcessIdsAndStatus(processIds, "NEW");
        long inProgress = requestRecordRepository.countByProcessIdsAndStatus(processIds, "IN_PROGRESS");
        long pending = requestRecordRepository.countByProcessIdsAndStatus(processIds, "PENDING");
        long closed = requestRecordRepository.countClosed(processIds);
        long rejected = requestRecordRepository.countByProcessIdsAndStatus(processIds, "REJECTED");
        long pendingEod = requestRecordRepository.countPendingEod(processIds);
        Double tat = requestRecordRepository.avgTatDays(processIds);
        long closedWithinSla = requestRecordRepository.countClosedWithinSla(processIds);
        double att = closed > 0 ? (closedWithinSla * 100.0 / closed) : 0.0;

        List<MetricsDTO.BpBreakdown> bpBreakdown = buildBpBreakdown(nodeType, nodeId);
        List<MetricsDTO.MarketRanking> topMarkets = buildTopMarkets(processIds);

        return MetricsDTO.builder()
                .nodeId(nodeId).nodeName(nodeName).nodeType(nodeType)
                .totalProcesses(processIds.size())
                .newRequests(newReqs).inProgressRequests(inProgress)
                .pendingRequests(pending).closedRequests(closed).rejectedRequests(rejected)
                .pendingEod(pendingEod)
                .tatDays(tat != null ? Math.round(tat * 10.0) / 10.0 : 0.0)
                .attPercentage(Math.round(att * 10.0) / 10.0)
                .businessProcessBreakdown(bpBreakdown)
                .topMarkets(topMarkets)
                .build();
    }

    private List<MetricsDTO.BpBreakdown> buildBpBreakdown(String nodeType, Long nodeId) {
        List<BusinessProcess> bps;
        if ("JOURNEY".equals(nodeType)) {
            bps = businessProcessRepository.findByJourneyId(nodeId);
        } else if ("BUSINESS_PROCESS".equals(nodeType)) {
            bps = businessProcessRepository.findById(nodeId).map(List::of).orElse(List.of());
        } else {
            Long bpId = resolveBpId(nodeType, nodeId);
            bps = bpId != null ? businessProcessRepository.findById(bpId).map(List::of).orElse(List.of()) : List.of();
        }

        return bps.stream().map(bp -> {
            List<Long> bpProcessIds = hierarchyService.getProcessIdsForBusinessProcess(bp.getId());
            if (bpProcessIds.isEmpty()) return new MetricsDTO.BpBreakdown(bp.getName(), 0, 0, 0);
            long newC = requestRecordRepository.countByProcessIdsAndStatus(bpProcessIds, "NEW");
            long closedC = requestRecordRepository.countClosed(bpProcessIds);
            long inProgC = requestRecordRepository.countByProcessIdsAndStatus(bpProcessIds, "IN_PROGRESS");
            return new MetricsDTO.BpBreakdown(bp.getName(), newC, closedC, inProgC);
        }).collect(Collectors.toList());
    }

    private Long resolveBpId(String nodeType, Long nodeId) {
        if ("SUB_BUSINESS_PROCESS".equals(nodeType)) {
            return subBusinessProcessRepository.findById(nodeId)
                    .map(SubBusinessProcess::getBusinessProcessId).orElse(null);
        }
        if ("PROCESS".equals(nodeType)) {
            return processEntityRepository.findById(nodeId).flatMap(proc ->
                    subBusinessProcessRepository.findById(proc.getSubBusinessProcessId())
                            .map(SubBusinessProcess::getBusinessProcessId)).orElse(null);
        }
        return null;
    }

    private List<MetricsDTO.MarketRanking> buildTopMarkets(List<Long> processIds) {
        List<Object[]> stats = requestRecordRepository.getMarketSlaStats(processIds);
        Map<Long, Market> marketMap = marketRepository.findAll().stream()
                .collect(Collectors.toMap(Market::getId, m -> m));

        List<MetricsDTO.MarketRanking> rankings = new ArrayList<>();
        int rank = 1;
        for (Object[] row : stats) {
            if (rank > 10) break;
            Long marketId = ((Number) row[0]).longValue();
            long total = ((Number) row[1]).longValue();
            long withinSla = ((Number) row[2]).longValue();
            long closedCount = ((Number) row[3]).longValue();
            double adherence = closedCount > 0 ? (withinSla * 100.0 / closedCount) : 0.0;

            Market market = marketMap.get(marketId);
            if (market != null && total > 0) {
                rankings.add(MetricsDTO.MarketRanking.builder()
                        .rank(rank++).marketName(market.getName()).marketCode(market.getCode())
                        .slaAdherencePercentage(Math.round(adherence * 10.0) / 10.0)
                        .totalRequests(total).closedRequests(closedCount).build());
            }
        }
        return rankings;
    }
}
