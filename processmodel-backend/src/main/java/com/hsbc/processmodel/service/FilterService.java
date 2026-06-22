package com.hsbc.processmodel.service;

import com.hsbc.processmodel.dto.FilterOptionsDTO;
import com.hsbc.processmodel.entity.*;
import com.hsbc.processmodel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FilterService {

    private final JourneyRepository journeyRepository;
    private final MarketRepository marketRepository;
    private final SiteRepository siteRepository;
    private final ProcessEntityRepository processEntityRepository;

    public FilterOptionsDTO getFilterOptions() {
        List<Journey> journeys = journeyRepository.findAll();
        List<Market> markets = marketRepository.findAll();
        List<Site> sites = siteRepository.findAll();
        List<ProcessEntity> processes = processEntityRepository.findAll();

        List<String> regions = markets.stream()
                .map(Market::getRegion).filter(Objects::nonNull)
                .distinct().sorted().collect(Collectors.toList());

        List<String> lobs = journeys.stream()
                .map(Journey::getLob).filter(Objects::nonNull)
                .distinct().sorted().collect(Collectors.toList());
        if (!lobs.contains("Wholesale Banking")) lobs.add("Wholesale Banking");
        Collections.sort(lobs);

        return FilterOptionsDTO.builder()
                .regions(regions)
                .countries(markets.stream()
                        .map(m -> new FilterOptionsDTO.CountryOption(m.getCode(), m.getName(), m.getRegion()))
                        .sorted(Comparator.comparing(FilterOptionsDTO.CountryOption::getName))
                        .collect(Collectors.toList()))
                .journeys(journeys.stream()
                        .map(j -> new FilterOptionsDTO.JourneyOption(j.getId(), j.getName(), j.getLob()))
                        .collect(Collectors.toList()))
                .lobs(lobs)
                .sites(sites.stream()
                        .map(s -> new FilterOptionsDTO.SiteOption(s.getId(), s.getName(), s.getCode(), s.getRegion(), s.getCountryCode()))
                        .sorted(Comparator.comparing(FilterOptionsDTO.SiteOption::getName))
                        .collect(Collectors.toList()))
                .processNames(processes.stream()
                        .map(p -> new FilterOptionsDTO.ProcessOption(p.getId(), p.getName(), p.getCode()))
                        .sorted(Comparator.comparing(FilterOptionsDTO.ProcessOption::getName))
                        .collect(Collectors.toList()))
                .build();
    }
}
