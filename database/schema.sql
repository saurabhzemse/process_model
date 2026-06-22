DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS markets CASCADE;
DROP TABLE IF EXISTS processes CASCADE;
DROP TABLE IF EXISTS sub_business_processes CASCADE;
DROP TABLE IF EXISTS business_processes CASCADE;
DROP TABLE IF EXISTS journeys CASCADE;

CREATE TABLE journeys (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE business_processes (
    id BIGSERIAL PRIMARY KEY,
    journey_id BIGINT NOT NULL REFERENCES journeys(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    sla_days INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sub_business_processes (
    id BIGSERIAL PRIMARY KEY,
    business_process_id BIGINT NOT NULL REFERENCES business_processes(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    sla_days INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE processes (
    id BIGSERIAL PRIMARY KEY,
    sub_business_process_id BIGINT NOT NULL REFERENCES sub_business_processes(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    sla_days INTEGER DEFAULT 2,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE markets (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    region VARCHAR(100),
    timezone VARCHAR(100) DEFAULT 'UTC'
);

CREATE TABLE requests (
    id BIGSERIAL PRIMARY KEY,
    process_id BIGINT NOT NULL REFERENCES processes(id),
    market_id BIGINT NOT NULL REFERENCES markets(id),
    reference_number VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('NEW', 'IN_PROGRESS', 'PENDING', 'CLOSED', 'REJECTED')),
    priority VARCHAR(20) DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    due_date DATE NOT NULL,
    closed_at TIMESTAMP,
    assigned_to VARCHAR(255),
    sla_breached BOOLEAN DEFAULT FALSE,
    notes TEXT
);

CREATE INDEX idx_requests_process_id ON requests(process_id);
CREATE INDEX idx_requests_market_id ON requests(market_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_created_at ON requests(created_at);
CREATE INDEX idx_requests_due_date ON requests(due_date);
