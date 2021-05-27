import unittest
from data_formatter import DataFormatter
import os

class TestDataFormatter(unittest.TestCase):
	def test_integration(self):
		print("\n###################### integration_test ######################\n")
		test_jobs_file = open("dataformatter_QA/one_jobpost.txt","r")
		dataformatter.preprocessing(test_jobs_file)
		test_jobs_file.close()
		for i in range(len(dataformatter.jobPosts)):  
			o_P = dataformatter.origPosts[i].split('\n')
			self.assertEqual(dataformatter.extract_seniority(o_P),-1)
			#INDUSTRY
			self.assertEqual(dataformatter.extract_industry(o_P,dataformatter.linkedin_industries),["Information Technology and Services","Computer Software","Internet"])
			#Keyword Extraction -----
			#Languages
			self.assertEqual(set(dataformatter.extract_languages(dataformatter.jobPosts[i],dataformatter.languages)),set(['java','javascript']))
			#TECH SKILLS
			self.assertEqual(set(dataformatter.extract_tech_terms(dataformatter.jobPosts[i], dataformatter.keywords)),set(['database','testing','product','zoom','communication','web application','linux','software development','mvc']))
			#Degree level
			self.assertEqual(dataformatter.extract_degree_lvl(dataformatter.jobPosts[i]),['b'])
			#DEGREE TITLE
			self.assertEqual(dataformatter.extract_degree_title(dataformatter.jobPosts[i]),['computer science'])
			#YoE
			self.assertEqual(dataformatter.extract_yoe(dataformatter.jobPosts[i]),-1)

	def test_read_termsFile(self):
		print("\n###################### Testing read_termsFile ######################\n")
		test_terms_file = open("test_terms_file.txt","w+")
		test_terms_file.writelines(['python\n','java\n','rust\n'])
		test_terms_file.close()
		output = dataformatter.read_termsFile("test_terms_file.txt")
		self.assertEqual(output,['python','java','rust'])
		os.remove("test_terms_file.txt")
	
	def test_extract_seniority(self):
		print("\n###################### Testing extract_seniority ######################\n")
		
		o_P = ["Seniority Level","mid-senior level"]
		self.assertEqual(dataformatter.extract_seniority(o_P),"mid-senior level")
		
		o_P = ["Seniority Level"]
		with self.assertRaises(IndexError):
			self.assertEqual(dataformatter.extract_seniority(o_P),-1)
			print("test assumes there's a next line after seniority level")
		
		o_P = ["Seniority Level","garbage"]
		self.assertEqual(dataformatter.extract_seniority(o_P),-1)
		
		o_P = ["Seniority level","Associate"]
		self.assertEqual(dataformatter.extract_seniority(o_P),"associate")

	def test_extract_industry(self):
		print("\n###################### Testing extract_industry ######################\n")
		
		#Test it only gets stuff from the standarlized list
		o_P = ["Industry","garbage"]
		industries = dataformatter.extract_industry(o_P,dataformatter.linkedin_industries)
		self.assertEqual(industries,[])
		
		o_P = ['Industry']
		#Test it assumes there's a industry list after "Industry"
		with self.assertRaises(IndexError):
			industries = dataformatter.extract_industry(o_P,dataformatter.linkedin_industries)
			self.assertEqual(industries,-1)
		print("test assumes there's a next line after extract industry")
		#Test if it works normally
		o_P = ["Industry","Computer Software  Internet  Financial Services"]
		industries = dataformatter.extract_industry(o_P,dataformatter.linkedin_industries)
		self.assertEqual(set(industries),set(["Internet","Financial Services","Computer Software"]))
		#Test commas, punctuations
		o_P = ["Industry","Computer Hardware,  Computer Software,  Consumer Electronics"]
		industries = dataformatter.extract_industry(o_P,dataformatter.linkedin_industries)
		self.assertEqual(set(industries),set(["Computer Hardware","Consumer Electronics","Computer Software"]))
		#Test 'and' / '&'
		o_P = ["Industry","Electrical & Electronic Manufacturing  Computer Software  Automotive"]
		industries = dataformatter.extract_industry(o_P,dataformatter.linkedin_industries)
		self.assertEqual(set(industries),set(["Electrical & Electronic Manufacturing","Automotive","Computer Software"]))

	def test_extract_languages(self):
		print("\n###################### Testing extract_languages ######################\n")
		jp = " pythonn "
		lang = dataformatter.extract_languages(jp,dataformatter.languages)
		self.assertEqual(set(lang),set([]))

		jp = " python "
		lang = dataformatter.extract_languages(jp,dataformatter.languages)
		self.assertEqual(set(lang),set(["python"]))

		jp = " java python sql nosql html css scss"
		lang = dataformatter.extract_languages(jp,dataformatter.languages)
		self.assertEqual(set(lang),set(["java","python","sql","nosql","html","css","scss"]))

		jp = " pythonn javascript java ruby "
		lang = dataformatter.extract_languages(jp,dataformatter.languages)
		self.assertEqual(set(lang),set(["javascript","java","ruby"]))
		print("Assumes GO not Golang")
		jp = " go c c++ c# "
		lang = dataformatter.extract_languages(jp,dataformatter.languages)
		self.assertEqual(set(lang),set(["go","c","c++","c#"]))
	
	def test_extract_tech_terms(self):
		print("\n###################### Testing extract_tech_terms ######################\n")
		jp = " python "
		tech = dataformatter.extract_tech_terms(jp,dataformatter.keywords)
		self.assertEqual(set(tech),set([]))

		jp = " angular "
		tech = dataformatter.extract_tech_terms(jp,dataformatter.keywords)
		self.assertEqual(set(tech),set(["angular"]))
		
		print("Some margin of error deadling with tech words in tech words like react in react native, can't be detected specifically")
		jp = " react "
		tech = dataformatter.extract_tech_terms(jp,dataformatter.keywords)
		self.assertEqual(set(tech),set(["react"]))

		print("Some margin of error, deadling with plurals and different ways of saying same terms like Vue vs Vue.js")
		jp = " vue fdjsklfjlsd convolutional neural network lstm jskdfjlsdkfj ocr "
		tech = dataformatter.extract_tech_terms(jp,dataformatter.keywords)
		self.assertEqual(set(tech),set(["vue","convolutional neural network","lstm","ocr"]))

	def test_extract_degree_lvl(self):
		print("\n###################### Testing extract_degree_lvl ######################\n")
		jp = " bachelor master "
		dl = dataformatter.extract_degree_lvl(jp)
		self.assertEqual(set(dl),set(['b','m']))

		jp = " master's "
		dl = dataformatter.extract_degree_lvl(jp)
		self.assertEqual(set(dl),set(['m']))

		jp = " ph d in computer science "
		dl = dataformatter.extract_degree_lvl(jp)
		self.assertEqual(set(dl),set(['p']))

		jp = " graduate degree like a master's or phd in computer science "
		dl = dataformatter.extract_degree_lvl(jp)
		self.assertEqual(set(dl),set(['m','p']))

		jp = " b s m s ph d "
		dl = dataformatter.extract_degree_lvl(jp)
		self.assertEqual(set(dl),set(['b','m','p']))

	def test_degree_title(self):
		print("\n###################### Testing extract_degree_title ######################\n")
		jp = "a degree in computer science "
		dt = dataformatter.extract_degree_title(jp)
		self.assertEqual(set(dt),set(['computer science']))

		jp = "completing a ph d in computer science electrical engineering or a related stem field"
		#periods,commas should be removed
		dt = dataformatter.extract_degree_title(jp)
		self.assertEqual(set(dt),set(['computer science','electrical engineering']))

		jp = "bachelor’s degree or foreign equivalent in computer engineering or computer science "
		dt = dataformatter.extract_degree_title(jp)
		self.assertEqual(set(dt),set(['computer science','computer engineering']))
	
	def test_extract_yoe(self):
		print("\n###################### Testing extract_yoe ######################\n")
		print('We are finding years of INDUSTRY/WORK experience NOT \'relevant\' experience')
		print('assumes theres no + after number')
		jp = "BS degree in Computer Science, Computer Engineering, or other relevant majors with 3 years of work experience fdsf fsd sf sf"
		y = dataformatter.extract_yoe(jp)
		self.assertEqual(y,3)

		jp = "We are a company with 20 employees"
		y = dataformatter.extract_yoe(jp)
		self.assertEqual(y,-1)

		jp = "We are a company that's been serving best internet solutions for 40 years"
		y = dataformatter.extract_yoe(jp)
		self.assertEqual(y,-1)

		jp = "5 or more years of experience in a Tech leadership position"
		y = dataformatter.extract_yoe(jp)
		self.assertEqual(y,5)
	
		jp = "five plus years of management experience"
		y = dataformatter.extract_yoe(jp)
		self.assertEqual(y,-1)

	def test_preprocessing(self):
		print("\n###################### Testing preprocessing ######################\n")
		#Testing just 1 job post
		test_jobs_file = open("test_jobs.txt","w+")
		test_jobs_file.write('BREAK123456789\nHello World, this is just a testing string')
		test_jobs_file.close()
		test_jobs_file = open("test_jobs.txt","r")
		dataformatter.preprocessing(test_jobs_file)
		test_jobs_file.close()
		self.assertEqual(dataformatter.origPosts,['Hello World, this is just a testing string'])
		self.assertEqual(dataformatter.jobPosts,['hello world this is just a testing string'])
		self.assertEqual(dataformatter.id_list,[123456789])
		os.remove("test_jobs.txt")
		#Testing 2 job posts with multiple lines each
		test_jobs_file = open("test_jobs.txt","w+")
		test_jobs_file.write('BREAK123456789\nHello World, this is just a testing string\nHello people\nBREAK53234\nYesss!\nGuacomole')
		test_jobs_file.close()
		test_jobs_file = open("test_jobs.txt","r")
		dataformatter.preprocessing(test_jobs_file)
		test_jobs_file.close()
		self.assertEqual(dataformatter.origPosts,['Hello World, this is just a testing string\nHello people\n', 'Yesss!\nGuacomole'])
		self.assertEqual(dataformatter.jobPosts,['hello world this is just a testing string hello people ','yesss guacomole'])
		self.assertEqual(dataformatter.id_list,[123456789,53234])
		os.remove("test_jobs.txt")
		#Testing replacing symbols with spaces (except +) but with no consecutive spaces
		test_jobs_file = open("test_jobs.txt","w+")
		test_jobs_file.write('BREAK123456789\n50+ years of experience??!@#$%^&*()_+ python. a-b testing')
		test_jobs_file.close()
		test_jobs_file = open("test_jobs.txt","r")
		dataformatter.preprocessing(test_jobs_file)
		test_jobs_file.close()
		self.assertEqual(dataformatter.origPosts,['50+ years of experience??!@#$%^&*()_+ python. a-b testing'])
		self.assertEqual(dataformatter.jobPosts,['50+ years of experience # _+ python a-b testing'])
		self.assertEqual(dataformatter.id_list,[123456789])
	
	
	
if __name__ == '__main__':
	dataformatter = DataFormatter()
	print("Entire Test ASSUMES keywords (tech terms, keywords, degree title/level) wont be the first or last word as it doesnt rly happen, (there's space before or after words)")
	unittest.main()
	
