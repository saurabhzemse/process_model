-- ============================================================
-- HSBC Process Intelligence Dashboard - Seed Data
-- ============================================================

-- Journeys
INSERT INTO journeys (name, code, description, icon) VALUES
('Account Servicing', 'ACC_SVC', 'End-to-end account servicing operations including amendments, closures and maintenance', 'account-cog');

-- Business Processes
INSERT INTO business_processes (journey_id, name, code, description, sla_days) VALUES
(1, 'Amend Customer Details', 'AMEND_CUST', 'Processes for amending customer personal and identity details', 5),
(1, 'Account Closure', 'ACC_CLOSURE', 'Processes for closing customer accounts', 7),
(1, 'Account Maintenance', 'ACC_MAINT', 'Routine account maintenance and review processes', 3);

-- Sub Business Processes
INSERT INTO sub_business_processes (business_process_id, name, code, description, sla_days) VALUES
(1, 'Change of Name/Address', 'CHANGE_NAME_ADDR', 'Updating customer name or residential address details', 3),
(1, 'Contact Information Update', 'CONTACT_UPDATE', 'Updating customer phone, email and communication preferences', 2),
(1, 'Identity Document Update', 'ID_UPDATE', 'Updating government-issued identification documents', 4),
(2, 'Voluntary Closure', 'VOL_CLOSURE', 'Customer-initiated account closure', 5),
(2, 'Regulatory Closure', 'REG_CLOSURE', 'Compliance or regulatory mandated account closure', 7),
(3, 'Annual Review', 'ANNUAL_REVIEW', 'Yearly account review and KYC refresh', 3),
(3, 'Dormancy Management', 'DORMANCY', 'Managing dormant accounts per policy', 3);

-- Processes
INSERT INTO processes (sub_business_process_id, name, code, description, sla_days) VALUES
(1, 'Change of Name',               'CHANGE_NAME',     'Update customer legal name on account records', 2),
(1, 'Update Phone Number',          'UPDATE_PHONE',    'Update primary and secondary phone numbers', 1),
(1, 'Update Address',               'UPDATE_ADDR',     'Update residential or mailing address', 2),
(2, 'Update Email Address',         'UPDATE_EMAIL',    'Update customer email address for communications', 1),
(2, 'Update Communication Preference', 'UPDATE_COMM_PREF', 'Update preferred communication channel and language', 1),
(3, 'Update National ID',           'UPDATE_NAT_ID',   'Update national identity card details', 3),
(3, 'Update Passport',              'UPDATE_PASSPORT', 'Update passport number and expiry details', 3),
(3, 'Update Driving Licence',       'UPDATE_DL',       'Update driving licence details', 2),
(4, 'Customer Initiated Closure',   'CUST_CLOSURE',    'Process customer-requested account closure', 5),
(5, 'AML Closure',                  'AML_CLOSURE',     'Close account due to AML findings', 7),
(6, 'KYC Refresh',                  'KYC_REFRESH',     'Annual KYC document refresh and verification', 3),
(7, 'Dormancy Activation',          'DORMANCY_ACT',    'Reactivate dormant account upon customer request', 2);

-- Markets
INSERT INTO markets (name, code, region, timezone) VALUES
('Hong Kong',           'HK', 'Asia Pacific', 'Asia/Hong_Kong'),
('United Kingdom',      'UK', 'Europe',       'Europe/London'),
('United States',       'US', 'Americas',     'America/New_York'),
('Singapore',           'SG', 'Asia Pacific', 'Asia/Singapore'),
('United Arab Emirates','AE', 'Middle East',  'Asia/Dubai'),
('India',               'IN', 'Asia Pacific', 'Asia/Kolkata'),
('Malaysia',            'MY', 'Asia Pacific', 'Asia/Kuala_Lumpur'),
('China',               'CN', 'Asia Pacific', 'Asia/Shanghai'),
('Australia',           'AU', 'Asia Pacific', 'Australia/Sydney'),
('France',              'FR', 'Europe',       'Europe/Paris'),
('Germany',             'DE', 'Europe',       'Europe/Berlin'),
('Canada',              'CA', 'Americas',     'America/Toronto'),
('Mexico',              'MX', 'Americas',     'America/Mexico_City'),
('Brazil',              'BR', 'Americas',     'America/Sao_Paulo'),
('South Africa',        'ZA', 'Africa',       'Africa/Johannesburg');

-- ============================================================
-- Requests (600 rows via generate_series)
-- ============================================================
WITH req_base AS (
    SELECT
        i,
        -- Process distribution (weighted toward Amend Customer Details processes)
        CASE
            WHEN (i % 40) <  8 THEN 1   -- Change of Name
            WHEN (i % 40) < 14 THEN 2   -- Update Phone Number
            WHEN (i % 40) < 20 THEN 3   -- Update Address
            WHEN (i % 40) < 24 THEN 4   -- Update Email
            WHEN (i % 40) < 27 THEN 5   -- Update Comm Pref
            WHEN (i % 40) < 30 THEN 6   -- Update National ID
            WHEN (i % 40) < 32 THEN 7   -- Update Passport
            WHEN (i % 40) < 34 THEN 8   -- Update Driving Licence
            WHEN (i % 40) < 36 THEN 9   -- Customer Closure
            WHEN (i % 40) < 37 THEN 10  -- AML Closure
            WHEN (i % 40) < 38 THEN 11  -- KYC Refresh
            ELSE 12                      -- Dormancy Activation
        END AS process_id,
        -- Market distribution (HK, UK, SG, IN have higher volume)
        CASE
            WHEN (i % 100) <  18 THEN 1   -- HK  18%
            WHEN (i % 100) <  33 THEN 2   -- UK  15%
            WHEN (i % 100) <  46 THEN 4   -- SG  13%
            WHEN (i % 100) <  58 THEN 6   -- IN  12%
            WHEN (i % 100) <  67 THEN 3   -- US   9%
            WHEN (i % 100) <  74 THEN 5   -- AE   7%
            WHEN (i % 100) <  80 THEN 7   -- MY   6%
            WHEN (i % 100) <  85 THEN 8   -- CN   5%
            WHEN (i % 100) <  89 THEN 9   -- AU   4%
            WHEN (i % 100) <  92 THEN 10  -- FR   3%
            WHEN (i % 100) <  94 THEN 11  -- DE   2%
            WHEN (i % 100) <  96 THEN 12  -- CA   2%
            WHEN (i % 100) <  97 THEN 13  -- MX   1%
            WHEN (i % 100) <  99 THEN 14  -- BR   2%
            ELSE 15                        -- ZA   1%
        END AS market_id,
        -- Status distribution: 20% NEW, 25% IN_PROGRESS, 15% PENDING, 35% CLOSED, 5% REJECTED
        CASE
            WHEN (i % 20) <  4 THEN 'NEW'
            WHEN (i % 20) <  9 THEN 'IN_PROGRESS'
            WHEN (i % 20) < 12 THEN 'PENDING'
            WHEN (i % 20) < 19 THEN 'CLOSED'
            ELSE 'REJECTED'
        END AS status,
        -- Priority: 60% NORMAL, 20% HIGH, 10% LOW, 10% URGENT
        CASE
            WHEN (i % 10) < 6 THEN 'NORMAL'
            WHEN (i % 10) < 8 THEN 'HIGH'
            WHEN (i % 10) < 9 THEN 'LOW'
            ELSE 'URGENT'
        END AS priority,
        -- created_at: spread across last 60 days (evenly spaced, ~2.4 hours apart)
        (NOW() - INTERVAL '60 days' + (i * INTERVAL '2 hours 24 minutes')) AS created_at,
        -- SLA breach flag: ~15% of closed/rejected requests breached
        (i % 7 = 0) AS is_breached,
        -- Days offset for closed_at (1-5 days after creation)
        ((i % 5) + 1) AS close_offset_days,
        -- SLA days by process (mirrors the processes table)
        CASE
            WHEN (i % 40) <  8 THEN 2
            WHEN (i % 40) < 14 THEN 1
            WHEN (i % 40) < 20 THEN 2
            WHEN (i % 40) < 24 THEN 1
            WHEN (i % 40) < 27 THEN 1
            WHEN (i % 40) < 30 THEN 3
            WHEN (i % 40) < 32 THEN 3
            WHEN (i % 40) < 34 THEN 2
            WHEN (i % 40) < 36 THEN 5
            WHEN (i % 40) < 37 THEN 7
            WHEN (i % 40) < 38 THEN 3
            ELSE 2
        END AS sla_days
    FROM generate_series(1, 600) AS i
)
INSERT INTO requests (
    process_id, market_id, reference_number, status, priority,
    created_at, updated_at, due_date, closed_at, assigned_to, sla_breached
)
SELECT
    process_id,
    market_id,
    'REQ-2025-' || LPAD(i::TEXT, 6, '0') AS reference_number,
    status,
    priority,
    created_at,
    created_at + INTERVAL '1 hour' AS updated_at,
    (created_at::DATE + sla_days) AS due_date,
    CASE
        WHEN status IN ('CLOSED', 'REJECTED')
        THEN created_at + (close_offset_days * INTERVAL '1 day')
        ELSE NULL
    END AS closed_at,
    'ops.user' || ((i % 10) + 1) || '@hsbc.com' AS assigned_to,
    CASE
        WHEN status IN ('CLOSED', 'REJECTED') AND is_breached THEN TRUE
        ELSE FALSE
    END AS sla_breached
FROM req_base;
