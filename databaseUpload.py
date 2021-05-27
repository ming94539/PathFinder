from dbconnection import DBConnection
import sys
#table = {
#	'table': 'WebDeveloper',
#	'jobID': '4385545',
#	'seniority': 'Senior',
#	'industry': ['healthcare','telecommunication'],
#	'educationLevel':['bachelor','master'],
#	'degreeTitle':['ce','cs'],
#	'skills':['valgrind', 'visual studio', 'c++ frameworks'],
#	'languages': ['python', 'c++', 'c'],
#	'yoe': '5'
#}

# Global constants for checking data validation results
SENIORITY           = 0
INDUSTRY            = 1
DEGREE_TITLE        = 2
EDUCATION_LEVEL     = 3
SKILLS              = 4
LANGUAGES           = 5
YEARS_OF_EXPERIENCE = 6

# validate data
# Values:
#	None = NULL
#	0	 = No error
#  -1	 = Error
# Attributes:
#	result[0] = seniority
#	result[1] = industry
#	result[2] = degreeTitle
#	result[3] = educationLevel
#	result[4] = skills
#	result[5] = languages
#	result[6] = yoe
def eprint(string):
	print(string, file=sys.stderr)
def data_validation(table):
	seniorityVals = ['internship', 'entry evel', 'associate', 'mid-senior level', 'director', 'executive']
	educationVals = ['a', 'b', 'm', 'p']
	result = []

	seniority = table.get('seniority')
	if seniority == -1:
		result.append(None)
	elif not (seniority in seniorityVals):
		result.append(-1)
	else:
		result.append(0)

	industry = table.get('industry')
	if len(industry) == 0:
		result.append(None)
	else:
		result.append(0)

	degreeTitle = table.get('degreeTitle')
	if len(industry) == 0:
		result.append(None)
	else:
		result.append(0)

	educationLevels = table.get('educationLevel')
	invalidEducation = False
	if len(educationLevels) == 0:
		result.append(None)
	else:
		for e in educationLevels:
			if not (e in educationVals):
				result.append(-1)
				invalidEducation = True
				break
	
	if not invalidEducation:
		result.append(0)	

	skills = table.get('skills')
	if len(skills) == 0:
		result.append(None)
	else:
		result.append(0)

	languages = table.get('languages')
	if len(languages) == 0:
		result.append(None)
	else:
		result.append(0)

	yoe = int(table.get('yoe'))
	if yoe == -1:
		result.append(None)
	if yoe < 0 or yoe > 25:
		result.append(-1)
	else:
		result.append(0)

	return result

def db_uploadFunction(dbup_table):

	# establish session to database
	db = DBConnection()

	# validate table
	validationResults = data_validation(dbup_table)

	# insert into JobIDTable
	table = dbup_table['table']

	jobID = dbup_table['jobID']

	insert_JobIDTable = f"""
	    INSERT INTO JobIDTable (jobID, tableName)
	    VALUES ({jobID}, '{table}')
	"""
	db.add_stmt(insert_JobIDTable)


	# Insert to job table
	# todo: check validation results for NULL values in seniority and yoe
	if validationResults[SENIORITY] != -1 and validationResults[YEARS_OF_EXPERIENCE] != -1:
		seniority = dbup_table['seniority']
		yoe = dbup_table['yoe']
		if validationResults[SENIORITY] == None and validationResults[YEARS_OF_EXPERIENCE] == None:
			insert_JobTable = f"""
			    INSERT INTO {table} (jobID, seniority, yearsOfExperience)
			    VALUES ({jobID}, NULL, NULL)
			"""			
		elif validationResults[SENIORITY] == None:
			insert_JobTable = f"""
			    INSERT INTO {table} (jobID, seniority, yearsOfExperience)
			    VALUES ({jobID}, NULL, '{yoe}')
			"""
		elif validationResults[YEARS_OF_EXPERIENCE] == None:
			insert_JobTable = f"""
			    INSERT INTO {table} (jobID, seniority, yearsOfExperience)
			    VALUES ({jobID}, '{seniority}', NULL)
			"""		
		else:
			insert_JobTable = f"""
			    INSERT INTO {table} (jobID, seniority, yearsOfExperience)
			    VALUES ({jobID}, '{seniority}', '{yoe}')
			"""
		db.add_stmt(insert_JobTable)
	else:
		if validationResults[SENIORITY] == -1:
			seniority = dbup_table['seniority']
			print(f"Error: Invalid seniority value '{seniority}' in jobID {jobID}")
		if validationResults[YEARS_OF_EXPERIENCE] == -1:
			yoe = dbup_table['yoe']
			print(f"Error: Invalid yoe value '{yoe}' in jobID {jobID}")
		return -1

	# Insert to industries table
	if validationResults[INDUSTRY] == 0:
		industry = dbup_table['industry']
		for i in industry:
			insert_IndustyTable = f"""
			    INSERT INTO Industries (jobID, industry)
			    VALUES ({jobID}, '{i}')
			"""
			db.add_stmt(insert_IndustyTable)
	elif validationResults[INDUSTRY] == -1:
		industry = dbup_table['industry']
		print(f"Error: Invalid industry '{industry}' in jobID {jobID}, skipping insertion into Industries table")
	
	# Insert to education table
	if validationResults[EDUCATION_LEVEL] == 0:
		educationLevel = dbup_table['educationLevel']
		for e in educationLevel:
			insert_EducationTable = f"""
			    INSERT INTO Education (jobID, educationLevel)
			    VALUES ({jobID}, '{e}')
			"""
			db.add_stmt(insert_EducationTable)
	elif validationResults[EDUCATION_LEVEL] == -1:
		educationLevel = dbup_table['educationLevel']
		print(f"Error: Invalid educationLevel '{educationLevel}' in jobID {jobID}, skipping insertion into Education table")

	if validationResults[DEGREE_TITLE] == 0:
		degreeTitle = dbup_table['degreeTitle']
		for d in degreeTitle:
			insert_EducationTable = f"""
			    INSERT INTO Degrees (jobID, degreeTitle)
			    VALUES ({jobID}, '{d}')
			"""
			db.add_stmt(insert_EducationTable)
	elif validationResults[DEGREE_TITLE] == -1:
		degreeTitle = dbup_table['degreeTitle']
		print(f"Error: Invalid degreeTitle '{degreeTitle}' in jobID {jobID}, skipping insertion into Degrees table")	

	# Insert to skills table
	if validationResults[SKILLS] == 0:
		skills = dbup_table['skills']
		for s in skills:
			insert_SkillsTable = f"""
			    INSERT INTO Skills (jobID, skill)
			    VALUES ({jobID}, '{s}')
			"""
			db.add_stmt(insert_SkillsTable)
	elif validationResults[SKILLS] == -1:
		skills = dbup_table['skills']
		print(f"Error: Invalid skills '{skills}' in jobID {jobID}, skipping insertion into Skills table")

	# Insert to languages table
	if validationResults[LANGUAGES] == 0:
		languages = dbup_table['languages']
		for l in languages:
			insert_LanguagesTable = f"""
			    INSERT INTO Languages (jobID, language)
			    VALUES ({jobID}, '{l}')
			"""
			db.add_stmt(insert_LanguagesTable)
	elif validationResults[LANGUAGES] == -1:
		languages = dbup_table['languages']
		print(f"Error: Invalid languages '{languages}' in jobID {jobID}, skipping insertion into Languages table")

	db.execute()
	return 0
