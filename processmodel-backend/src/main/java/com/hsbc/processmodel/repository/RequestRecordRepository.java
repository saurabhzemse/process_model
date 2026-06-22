package com.hsbc.processmodel.repository;

import com.hsbc.processmodel.entity.RequestRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RequestRecordRepository extends JpaRepository<RequestRecord, Long> {

    @Query("SELECT COUNT(r) FROM RequestRecord r WHERE r.processId IN :processIds AND r.status = :status")
    long countByProcessIdsAndStatus(@Param("processIds") List<Long> processIds, @Param("status") String status);

    @Query("SELECT COUNT(r) FROM RequestRecord r WHERE r.processId IN :processIds AND r.status NOT IN ('CLOSED', 'REJECTED') AND r.dueDate <= CURRENT_DATE")
    long countPendingEod(@Param("processIds") List<Long> processIds);

    @Query(value = "SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (closed_at - created_at)) / 86400.0), 0.0) FROM requests WHERE process_id IN :processIds AND status = 'CLOSED'", nativeQuery = true)
    Double avgTatDays(@Param("processIds") List<Long> processIds);

    @Query(value = "SELECT COUNT(*) FROM requests WHERE process_id IN :processIds AND status = 'CLOSED' AND sla_breached = false", nativeQuery = true)
    long countClosedWithinSla(@Param("processIds") List<Long> processIds);

    @Query(value = "SELECT COUNT(*) FROM requests WHERE process_id IN :processIds AND status = 'CLOSED'", nativeQuery = true)
    long countClosed(@Param("processIds") List<Long> processIds);

    @Query(value = "SELECT market_id, COUNT(*), " +
           "SUM(CASE WHEN sla_breached = false AND status = 'CLOSED' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN status = 'CLOSED' THEN 1 ELSE 0 END) " +
           "FROM requests WHERE process_id IN :processIds " +
           "GROUP BY market_id " +
           "ORDER BY (SUM(CASE WHEN sla_breached = false AND status = 'CLOSED' THEN 1 ELSE 0 END) * 1.0 / NULLIF(SUM(CASE WHEN status = 'CLOSED' THEN 1 ELSE 0 END), 0)) DESC NULLS LAST", nativeQuery = true)
    List<Object[]> getMarketSlaStats(@Param("processIds") List<Long> processIds);

    List<RequestRecord> findByProcessIdIn(List<Long> processIds);

    @Query("SELECT COUNT(r) FROM RequestRecord r WHERE r.processId IN :processIds")
    long countByProcessIds(@Param("processIds") List<Long> processIds);

    // Filtered count by status
    @Query(value = "SELECT COUNT(*) FROM requests r " +
            "JOIN markets m ON r.market_id = m.id " +
            "WHERE r.process_id IN :processIds AND r.status = :status " +
            "AND (:regionEmpty = true OR m.region IN :regions) " +
            "AND (:countryEmpty = true OR m.code IN :countries) " +
            "AND (:siteEmpty = true OR r.site_id IN :siteIds)",
            nativeQuery = true)
    long countByProcessIdsAndStatusFiltered(
            @Param("processIds") List<Long> processIds,
            @Param("status") String status,
            @Param("regions") List<String> regions,
            @Param("regionEmpty") boolean regionEmpty,
            @Param("countries") List<String> countries,
            @Param("countryEmpty") boolean countryEmpty,
            @Param("siteIds") List<Long> siteIds,
            @Param("siteEmpty") boolean siteEmpty);

    // Filtered pending EOD
    @Query(value = "SELECT COUNT(*) FROM requests r " +
            "JOIN markets m ON r.market_id = m.id " +
            "WHERE r.process_id IN :processIds " +
            "AND r.status NOT IN ('CLOSED', 'REJECTED') AND r.due_date <= CURRENT_DATE " +
            "AND (:regionEmpty = true OR m.region IN :regions) " +
            "AND (:countryEmpty = true OR m.code IN :countries) " +
            "AND (:siteEmpty = true OR r.site_id IN :siteIds)",
            nativeQuery = true)
    long countPendingEodFiltered(
            @Param("processIds") List<Long> processIds,
            @Param("regions") List<String> regions,
            @Param("regionEmpty") boolean regionEmpty,
            @Param("countries") List<String> countries,
            @Param("countryEmpty") boolean countryEmpty,
            @Param("siteIds") List<Long> siteIds,
            @Param("siteEmpty") boolean siteEmpty);

    // Filtered average TAT
    @Query(value = "SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (r.closed_at - r.created_at)) / 86400.0), 0.0) " +
            "FROM requests r JOIN markets m ON r.market_id = m.id " +
            "WHERE r.process_id IN :processIds AND r.status = 'CLOSED' " +
            "AND (:regionEmpty = true OR m.region IN :regions) " +
            "AND (:countryEmpty = true OR m.code IN :countries) " +
            "AND (:siteEmpty = true OR r.site_id IN :siteIds)",
            nativeQuery = true)
    Double avgTatDaysFiltered(
            @Param("processIds") List<Long> processIds,
            @Param("regions") List<String> regions,
            @Param("regionEmpty") boolean regionEmpty,
            @Param("countries") List<String> countries,
            @Param("countryEmpty") boolean countryEmpty,
            @Param("siteIds") List<Long> siteIds,
            @Param("siteEmpty") boolean siteEmpty);

    // Filtered closed count
    @Query(value = "SELECT COUNT(*) FROM requests r JOIN markets m ON r.market_id = m.id " +
            "WHERE r.process_id IN :processIds AND r.status = 'CLOSED' " +
            "AND (:regionEmpty = true OR m.region IN :regions) " +
            "AND (:countryEmpty = true OR m.code IN :countries) " +
            "AND (:siteEmpty = true OR r.site_id IN :siteIds)",
            nativeQuery = true)
    long countClosedFiltered(
            @Param("processIds") List<Long> processIds,
            @Param("regions") List<String> regions,
            @Param("regionEmpty") boolean regionEmpty,
            @Param("countries") List<String> countries,
            @Param("countryEmpty") boolean countryEmpty,
            @Param("siteIds") List<Long> siteIds,
            @Param("siteEmpty") boolean siteEmpty);

    // Filtered closed within SLA
    @Query(value = "SELECT COUNT(*) FROM requests r JOIN markets m ON r.market_id = m.id " +
            "WHERE r.process_id IN :processIds AND r.status = 'CLOSED' AND r.sla_breached = false " +
            "AND (:regionEmpty = true OR m.region IN :regions) " +
            "AND (:countryEmpty = true OR m.code IN :countries) " +
            "AND (:siteEmpty = true OR r.site_id IN :siteIds)",
            nativeQuery = true)
    long countClosedWithinSlaFiltered(
            @Param("processIds") List<Long> processIds,
            @Param("regions") List<String> regions,
            @Param("regionEmpty") boolean regionEmpty,
            @Param("countries") List<String> countries,
            @Param("countryEmpty") boolean countryEmpty,
            @Param("siteIds") List<Long> siteIds,
            @Param("siteEmpty") boolean siteEmpty);

    // Filtered market SLA stats
    @Query(value = "SELECT r.market_id, COUNT(*), " +
            "SUM(CASE WHEN r.sla_breached = false AND r.status = 'CLOSED' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.status = 'CLOSED' THEN 1 ELSE 0 END) " +
            "FROM requests r JOIN markets m ON r.market_id = m.id " +
            "WHERE r.process_id IN :processIds " +
            "AND (:regionEmpty = true OR m.region IN :regions) " +
            "AND (:countryEmpty = true OR m.code IN :countries) " +
            "AND (:siteEmpty = true OR r.site_id IN :siteIds) " +
            "GROUP BY r.market_id " +
            "ORDER BY (SUM(CASE WHEN r.sla_breached = false AND r.status = 'CLOSED' THEN 1 ELSE 0 END) * 1.0 " +
            "/ NULLIF(SUM(CASE WHEN r.status = 'CLOSED' THEN 1 ELSE 0 END), 0)) DESC NULLS LAST",
            nativeQuery = true)
    List<Object[]> getMarketSlaStatsFiltered(
            @Param("processIds") List<Long> processIds,
            @Param("regions") List<String> regions,
            @Param("regionEmpty") boolean regionEmpty,
            @Param("countries") List<String> countries,
            @Param("countryEmpty") boolean countryEmpty,
            @Param("siteIds") List<Long> siteIds,
            @Param("siteEmpty") boolean siteEmpty);
}
