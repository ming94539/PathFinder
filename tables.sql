CREATE TABLE JobIDTable (
	jobID INTEGER NOT NULL,
	table VARCHAR(60),
	PRIMARY KEY (jobID)
);

CREATE TABLE Industries (
  jobID INTEGER PRIMARY KEY NOT NULL,
  industry VARCHAR(50) NOT NULL,
  jobID INTEGER FOREIGN KEY REFERENCES JobIDTable(jobID)
);

CREATE TABLE Education (
  jobID INTEGER PRIMARY KEY NOT NULL,
  degreeTitle VARCHAR(50),
  educationLevel VARCHAR(1),
  jobID INTEGER FOREIGN KEY REFERENCES JobIDTable(jobID)
);

CREATE TABLE Skills (
  jobID INTEGER PRIMARY KEY NOT NULL,
  skill VARCHAR(60) NOT NULL,
  jobID INTEGER FOREIGN KEY REFERENCES JobIDTable(jobID)
);

CREATE TABLE Languages (
  jobID INTEGER PRIMARY KEY NOT NULL,
  language VARCHAR(30) NOT NULL,
  jobID INTEGER FOREIGN KEY REFERENCES JobIDTable(jobID)
);

CREATE TABLE WebDeveloper (
	jobID INTEGER NOT NULL,
	seniority VARCHAR(30),
	yearsOfExperience INTEGER,
	PRIMARY KEY (jobID),
	FOREIGN KEY (jobID) REFERENCES JobIDTable(jobID)
); 
