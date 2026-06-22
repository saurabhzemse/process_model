package com.hsbc.processmodel.repository;

import com.hsbc.processmodel.entity.BusinessProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BusinessProcessRepository extends JpaRepository<BusinessProcess, Long> {
    List<BusinessProcess> findByJourneyId(Long journeyId);
}
