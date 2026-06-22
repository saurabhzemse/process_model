package com.hsbc.processmodel.repository;

import com.hsbc.processmodel.entity.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SiteRepository extends JpaRepository<Site, Long> {
    List<Site> findByCountryCode(String countryCode);
    List<Site> findByRegion(String region);
}
