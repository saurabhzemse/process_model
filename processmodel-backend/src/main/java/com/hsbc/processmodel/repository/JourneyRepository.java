package com.hsbc.processmodel.repository;

import com.hsbc.processmodel.entity.Journey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JourneyRepository extends JpaRepository<Journey, Long> {
}
