package com.hsbc.processmodel.controller;

import com.hsbc.processmodel.dto.HierarchyNodeDTO;
import com.hsbc.processmodel.service.HierarchyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hierarchy")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
@RequiredArgsConstructor
public class HierarchyController {

    private final HierarchyService hierarchyService;

    @GetMapping("/journeys")
    public ResponseEntity<List<HierarchyNodeDTO>> getJourneys() {
        return ResponseEntity.ok(hierarchyService.getJourneys());
    }

    @GetMapping("/journeys/{id}/business-processes")
    public ResponseEntity<List<HierarchyNodeDTO>> getBusinessProcesses(@PathVariable Long id) {
        return ResponseEntity.ok(hierarchyService.getBusinessProcessesByJourney(id));
    }

    @GetMapping("/business-processes/{id}/sub-processes")
    public ResponseEntity<List<HierarchyNodeDTO>> getSubProcesses(@PathVariable Long id) {
        return ResponseEntity.ok(hierarchyService.getSubProcessesByBusinessProcess(id));
    }

    @GetMapping("/sub-processes/{id}/processes")
    public ResponseEntity<List<HierarchyNodeDTO>> getProcesses(@PathVariable Long id) {
        return ResponseEntity.ok(hierarchyService.getProcessesBySubProcess(id));
    }
}
