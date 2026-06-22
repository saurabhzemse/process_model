-- LOB on journeys
ALTER TABLE journeys ADD COLUMN IF NOT EXISTS lob VARCHAR(100) DEFAULT 'Retail Banking';
UPDATE journeys SET lob = 'Retail Banking' WHERE code = 'ACC_SVC';
UPDATE journeys SET lob = 'Retail Banking' WHERE code = 'ACC_CLOSURE';
UPDATE journeys SET lob = 'Retail Banking' WHERE code = 'ACC_MAINT';

-- Sites table
CREATE TABLE IF NOT EXISTS sites (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    region VARCHAR(100),
    country_code VARCHAR(10)
);

INSERT INTO sites (name, code, region, country_code) VALUES
('Hong Kong Operations Centre', 'HK_OPS', 'Asia Pacific', 'HK'),
('London Operations Hub', 'UK_LON', 'Europe', 'UK'),
('Birmingham Service Centre', 'UK_BHM', 'Europe', 'UK'),
('Singapore Regional Hub', 'SG_REG', 'Asia Pacific', 'SG'),
('Mumbai Operations Centre', 'IN_MUM', 'Asia Pacific', 'IN'),
('Chennai Service Hub', 'IN_CHN', 'Asia Pacific', 'IN'),
('New York Operations', 'US_NYC', 'Americas', 'US'),
('Dubai Regional Centre', 'AE_DXB', 'Middle East', 'AE'),
('Kuala Lumpur Operations', 'MY_KUL', 'Asia Pacific', 'MY'),
('Shanghai Service Centre', 'CN_SHA', 'Asia Pacific', 'CN'),
('Sydney Operations', 'AU_SYD', 'Asia Pacific', 'AU'),
('Paris Service Centre', 'FR_PAR', 'Europe', 'FR'),
('Frankfurt Operations', 'DE_FRA', 'Europe', 'DE'),
('Toronto Service Centre', 'CA_TOR', 'Americas', 'CA'),
('Johannesburg Hub', 'ZA_JHB', 'Africa', 'ZA');

-- Add site_id to requests
ALTER TABLE requests ADD COLUMN IF NOT EXISTS site_id BIGINT;

-- Assign sites to requests based on their market's country code
UPDATE requests r
SET site_id = (
    SELECT s.id FROM sites s
    JOIN markets m ON s.country_code = m.code
    WHERE m.id = r.market_id
    ORDER BY s.id
    LIMIT 1
);
