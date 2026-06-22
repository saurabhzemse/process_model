package com.hsbc.processmodel.controller;

import com.hsbc.processmodel.dto.FilterOptionsDTO;
import com.hsbc.processmodel.service.FilterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/filters")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
@RequiredArgsConstructor
public class FilterController {

    private final FilterService filterService;

    @GetMapping
    public ResponseEntity<FilterOptionsDTO> getFilterOptions() {
        return ResponseEntity.ok(filterService.getFilterOptions());
    }
}
