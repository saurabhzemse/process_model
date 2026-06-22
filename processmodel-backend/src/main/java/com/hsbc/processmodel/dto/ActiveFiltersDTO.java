package com.hsbc.processmodel.dto;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ActiveFiltersDTO {
    private List<String> regions;
    private List<String> countries;
    private List<Long> siteIds;
    private String lob;
    private List<Long> journeyIds;
    private List<Long> processIds;
}
