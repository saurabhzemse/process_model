package com.hsbc.processmodel.repository;

import com.hsbc.processmodel.entity.SubBusinessProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubBusinessProcessRepository extends JpaRepository<SubBusinessProcess, Long> {
    List<SubBusinessProcess> findByBusinessProcessId(Long businessProcessId);
}
