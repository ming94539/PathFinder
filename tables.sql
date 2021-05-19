CREATE TABLE JobIDTable (
	jobID VARCHAR(15),
	tablename VARCHAR(60),
  PRIMARY KEY (jobID)
);

CREATE TABLE Industries (
  jobID VARCHAR(15) NOT NULL,
  industry VARCHAR(50) NOT NULL,
  FOREIGN KEY (jobID) REFERENCES JobIDTable(jobID)
);

CREATE TABLE Education (
  jobID VARCHAR(15) NOT NULL,
  degreeTitle VARCHAR(50),
  educationLevel VARCHAR(1),
  FOREIGN KEY (jobID) REFERENCES JobIDTable(jobID)
);

CREATE TABLE Skills (
  jobID VARCHAR(15) NOT NULL,
  skill VARCHAR(60) NOT NULL,
  FOREIGN KEY (jobID) REFERENCES JobIDTable(jobID)
);

CREATE TABLE Languages (
  jobID VARCHAR(15) NOT NULL,
  language VARCHAR(30) NOT NULL,
  FOREIGN KEY (jobID) REFERENCES JobIDTable(jobID)
);

CREATE TABLE WebDeveloper (
  jobID VARCHAR(15) NOT NULL,
  seniority VARCHAR(30),
  yearsOfExperience INTEGER,
  PRIMARY KEY (jobID),
  FOREIGN KEY (jobID) REFERENCES JobIDTable(jobID)
); 
