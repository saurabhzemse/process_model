package com.hsbc.processmodel.repository;

import com.hsbc.processmodel.entity.ProcessEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProcessEntityRepository extends JpaRepository<ProcessEntity, Long> {
    List<ProcessEntity> findBySubBusinessProcessId(Long subBusinessProcessId);
    List<ProcessEntity> findAllById(Iterable<Long> ids);
}
