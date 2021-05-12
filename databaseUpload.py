<<<<<<< HEAD
=======
from dbconnection import DBConnection
>>>>>>> bda92bf91ad16c67509252d0448c58f8d83c4fb6
import json

# dictionary
# jobID INTEGER NOT NULL,
#	seniority VARCHAR(60),
#	industry VARCHAR(60),
#	educationLevel education_value,
#	degreeTitle VARCHAR(60),
#	skills json NOT NULL,
#	language json NOT NULL,

table = {
	'table': 'WebDeveloper',
	'jobID': '4385545',
	'seniority': 'Senior',
	'industry': ['healthcare','telecommunication'],
	'educationLevel':['bachelor','master'],
	'degreeTitle':['ce','cs'],
	'skills':['valgrind', 'visual studio', 'c++ frameworks'],
	'languages': ['python', 'c++', 'c'],
	'yoe': '5'
}

seniorityVals = ['Internship', 'Entry Level', 'Associate', 'Mid-Senior Level', 'Director', 'Executive']
educationVals = ['a', 'b', 'm', 'p']

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
def data_validation(table):
	result = []

	seniority = table.get('seniority')
	if seniority == -1:
		result.append(None)
	else if not (seniority in seniorityVals):
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

	educationLevel = table.get('educationLevel')
	if len(educationLevel) == 0:
		result.append(None)
	else if not (educationLevel in educationVals):
		result.append(-1)
	else:
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

	yoe = int(table.get('yoe')):
	if yoe == -1:
		result.append(None)
	if yoe < 0 or yoe > 25:
		result.append(-1)
	else:
		result.append(0)

	return result


<<<<<<< HEAD

# convert lists to json
def list_to_json(list):
=======
	pass
>>>>>>> bda92bf91ad16c67509252d0448c58f8d83c4fb6

# establish session to database
db = DBConnection()

# insert into JobIDTable
table = table['table']
jobID = int(table['jobID'])

insert_JobIDTable = f"""
    INSERT INTO JobIDTable (jobID, table)
    VALUES ({jobID}, '{table}')
"""
db.execute(insert_JobIDTable)

# insert into specific table based on search
seniority = table['seniority']
industry = table['industry']
educationLevel = table['educationLevel']
degreeTitle = table['degreeTitle']
skills = table['skills']
languages = table['languages']
yoe = table['yoe']

# idk how to do the json stuff atm
# skills_json = join(dirname(realpath(__file__), 'skills.json'))
# language_json = join(dirname(realpath(__file__), 'language.json'))

insert_JobTable = f"""
    INSERT INTO {table} (jobID, seniority, industry, educationLevel, degreeTitle, skills, language)
    VALUES ({jobID}, '{seniority}', '{industry}', '{educationLevel}', '{degreeTitle}', ')
"""

# commit changes

# close connection
