package com.hsbc.processmodel.controller;

import com.hsbc.processmodel.dto.MetricsDTO;
import com.hsbc.processmodel.service.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/metrics")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
@RequiredArgsConstructor
public class MetricsController {

    private final MetricsService metricsService;

    @GetMapping
    public ResponseEntity<MetricsDTO> getMetrics(
            @RequestParam String nodeType,
            @RequestParam Long nodeId,
            @RequestParam(required = false) List<String> regions,
            @RequestParam(required = false) List<String> countries,
            @RequestParam(required = false) List<Long> siteIds,
            @RequestParam(required = false) String lob) {
        return ResponseEntity.ok(metricsService.getMetrics(nodeType, nodeId, regions, countries, siteIds, lob));
    }
}
