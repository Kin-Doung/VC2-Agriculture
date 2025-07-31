-- Create table to store scan history
CREATE TABLE IF NOT EXISTS scan_history (
    id SERIAL PRIMARY KEY,
    image_path VARCHAR(255),
    detected_rice_type VARCHAR(100),
    confidence_score DECIMAL(3,2),
    scan_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_feedback VARCHAR(20), -- 'correct', 'incorrect', 'unsure'
    actual_rice_type VARCHAR(100) -- for training data
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_scan_timestamp ON scan_history(scan_timestamp);
CREATE INDEX IF NOT EXISTS idx_rice_type ON scan_history(detected_rice_type);
