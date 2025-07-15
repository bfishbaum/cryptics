-- Create the cryptograms table for Azure SQL Database
CREATE TABLE cryptograms (
    id INT IDENTITY(1,1) PRIMARY KEY,
    puzzle NVARCHAR(MAX) NOT NULL,
    solution NVARCHAR(MAX) NOT NULL,
    explanation NVARCHAR(MAX),
    source VARCHAR(20) NOT NULL CHECK (source IN ('USER_SUBMITTED', 'AI_GENERATED', 'OFFICIAL')),
    difficulty INT NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
    date_added DATETIME2 DEFAULT SYSDATETIME()
);

-- Create indexes for better performance
CREATE INDEX idx_cryptograms_date_added ON cryptograms(date_added DESC);
CREATE INDEX idx_cryptograms_difficulty ON cryptograms(difficulty);
CREATE INDEX idx_cryptograms_source ON cryptograms(source);

-- Insert sample data
INSERT INTO cryptograms (puzzle, solution, explanation, source, difficulty, date_added) VALUES
('Clear portal to victory below, without no', 'window', 'CLEAR PORTAL - victory (WIN), below without no (DOW = DOWN - N)', 'OFFICIAL', 2, '2025-07-14T00:00:00.000Z'),
('Hear the briny! A messy trough is transparent', 'see-through', 'Hear the briny (SEE sounds like SEA) - Anagram of trough is through makes SEE THROUGH (transparent)', 'OFFICIAL', 4, '2025-07-15T00:00:00.000Z');