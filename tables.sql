CREATE TYPE education_value AS ENUM ('bachleor', 'master', 'doctorate');

CREATE TABLE JobIDTable (
	jobID INTEGER,
	table VARCHAR(60),
	PRIMARY KEY (jobID)
);

CREATE TABLE WebDeveloper (
	jobID INTEGER NOT NULL,
	seniority VARCHAR(60),
	industry VARCHAR(60),
	educationLevel education_value,
	degreeTitle VARCHAR(60),
	skills json NOT NULL,
	language json NOT NULL,
	PRIMARY KEY (jobID),
	FOREIGN KEY (jobID) REFERENCES JobIDTable
); 
