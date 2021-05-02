CREATE TYPE stack_value AS ENUM ('backend', 'frontend', 'full-stack');
CREATE TYPE education_value AS ENUM ('Bachleors', 'Masters', 'PhD');

CREATE TABLE JobIDTable (
	jobID INTEGER,
	table VARCHAR(60),
	PRIMARY KEY (jobID)
);

CREATE TABLE SoftwareEngineer (
	jobID INTEGER NOT NULL,
	seniority VARCHAR(60),
	industry VARCHAR(60),
	stack stack_value,
	education education_value,
	skills json NOT NULL,
	language json NOT NULL,
	preferences json,
	PRIMARY KEY (jobID),
	FOREIGN KEY (jobID) REFERENCES JobIDTable
);

CREATE TABLE Security (
	jobID INTEGER NOT NULL,
	seniority VARCHAR(60),
	industry VARCHAR(60),
	stack stack_value,
	education education_value,
	skills json NOT NULL,
	language json NOT NULL,
	preferences json,
	PRIMARY KEY (jobID),
	FOREIGN KEY (jobID) REFERENCES JobIDTable
);
