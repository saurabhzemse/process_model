package com.hsbc.processmodel.service;

import com.hsbc.processmodel.dto.HierarchyNodeDTO;
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
public class HierarchyService {

    private final JourneyRepository journeyRepository;
    private final BusinessProcessRepository businessProcessRepository;
    private final SubBusinessProcessRepository subBusinessProcessRepository;
    private final ProcessEntityRepository processEntityRepository;
    private final RequestRecordRepository requestRecordRepository;

    public List<HierarchyNodeDTO> getJourneys() {
        return journeyRepository.findAll().stream().map(j -> {
            List<Long> processIds = getProcessIdsForJourney(j.getId());
            List<BusinessProcess> bps = businessProcessRepository.findByJourneyId(j.getId());
            return buildNodeDTO(j.getId(), j.getName(), j.getCode(), j.getDescription(),
                    "JOURNEY", null, bps.size(), processIds);
        }).collect(Collectors.toList());
    }

    public List<HierarchyNodeDTO> getBusinessProcessesByJourney(Long journeyId) {
        return businessProcessRepository.findByJourneyId(journeyId).stream().map(bp -> {
            List<Long> processIds = getProcessIdsForBusinessProcess(bp.getId());
            List<SubBusinessProcess> subBps = subBusinessProcessRepository.findByBusinessProcessId(bp.getId());
            return buildNodeDTO(bp.getId(), bp.getName(), bp.getCode(), bp.getDescription(),
                    "BUSINESS_PROCESS", journeyId, subBps.size(), processIds);
        }).collect(Collectors.toList());
    }

    public List<HierarchyNodeDTO> getSubProcessesByBusinessProcess(Long bpId) {
        return subBusinessProcessRepository.findByBusinessProcessId(bpId).stream().map(sub -> {
            List<Long> processIds = getProcessIdsForSubProcess(sub.getId());
            List<ProcessEntity> procs = processEntityRepository.findBySubBusinessProcessId(sub.getId());
            return buildNodeDTO(sub.getId(), sub.getName(), sub.getCode(), sub.getDescription(),
                    "SUB_BUSINESS_PROCESS", bpId, procs.size(), processIds);
        }).collect(Collectors.toList());
    }

    public List<HierarchyNodeDTO> getProcessesBySubProcess(Long subBpId) {
        return processEntityRepository.findBySubBusinessProcessId(subBpId).stream().map(proc -> {
            List<Long> processIds = List.of(proc.getId());
            return buildNodeDTO(proc.getId(), proc.getName(), proc.getCode(), proc.getDescription(),
                    "PROCESS", subBpId, 0, processIds);
        }).collect(Collectors.toList());
    }

    private HierarchyNodeDTO buildNodeDTO(Long id, String name, String code, String description,
            String level, Long parentId, int childCount, List<Long> processIds) {
        HierarchyNodeDTO.NodeMetrics metrics = HierarchyNodeDTO.NodeMetrics.builder().build();
        if (!processIds.isEmpty()) {
            long newReqs = requestRecordRepository.countByProcessIdsAndStatus(processIds, "NEW");
            long closedReqs = requestRecordRepository.countClosed(processIds);
            long pendingEod = requestRecordRepository.countPendingEod(processIds);
            Double tat = requestRecordRepository.avgTatDays(processIds);
            long closedWithinSla = requestRecordRepository.countClosedWithinSla(processIds);
            double att = closedReqs > 0 ? (closedWithinSla * 100.0 / closedReqs) : 0.0;

            metrics = HierarchyNodeDTO.NodeMetrics.builder()
                    .totalProcesses(processIds.size())
                    .newRequests(newReqs)
                    .closedRequests(closedReqs)
                    .pendingEod(pendingEod)
                    .tatDays(tat != null ? Math.round(tat * 10.0) / 10.0 : 0.0)
                    .attPercentage(Math.round(att * 10.0) / 10.0)
                    .build();
        }
        return HierarchyNodeDTO.builder()
                .id(id).name(name).code(code).description(description)
                .level(level).parentId(parentId).childCount(childCount)
                .metrics(metrics).build();
    }

    public List<Long> getProcessIdsForJourney(Long journeyId) {
        List<Long> result = new ArrayList<>();
        businessProcessRepository.findByJourneyId(journeyId)
                .forEach(bp -> result.addAll(getProcessIdsForBusinessProcess(bp.getId())));
        return result;
    }

    public List<Long> getProcessIdsForBusinessProcess(Long bpId) {
        List<Long> result = new ArrayList<>();
        subBusinessProcessRepository.findByBusinessProcessId(bpId)
                .forEach(sub -> result.addAll(getProcessIdsForSubProcess(sub.getId())));
        return result;
    }

    public List<Long> getProcessIdsForSubProcess(Long subBpId) {
        return processEntityRepository.findBySubBusinessProcessId(subBpId)
                .stream().map(ProcessEntity::getId).collect(Collectors.toList());
    }
}
