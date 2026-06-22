package com.hsbc.processmodel.dto;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FilterOptionsDTO {
    private List<String> regions;
    private List<CountryOption> countries;
    private List<JourneyOption> journeys;
    private List<String> lobs;
    private List<SiteOption> sites;
    private List<ProcessOption> processNames;

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class CountryOption {
        private String code;
        private String name;
        private String region;
    }

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class JourneyOption {
        private Long id;
        private String name;
        private String lob;
    }

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class SiteOption {
        private Long id;
        private String name;
        private String code;
        private String region;
        private String countryCode;
    }

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class ProcessOption {
        private Long id;
        private String name;
        private String code;
    }
}
