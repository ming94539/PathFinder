import unittest
from data_formatter import DataFormatter
import os

class TestDataFormatter(unittest.TestCase):

	def test_read_termsFile(self):
		print("\n###################### Testing read_termsFile ######################\n")
		test_termsFile = open("test_termsFile.txt","w+")
		test_termsFile.writelines(['python\n','java\n','rust\n'])
		test_termsFile.close()
		output = dataformatter.read_termsFile("test_termsFile.txt")
		self.assertEqual(output,['python','java','rust'])
		os.remove("test_termsFile.txt")
	
	def test_extract_seniority(self):
		print("\n###################### Testing extract_seniority ######################\n")
		
		o_P = ["Seniority Level","Mid-Senior level"]
		self.assertEqual(dataformatter.extract_seniority(o_P),"Mid-Senior level")
		
		o_P = ["Seniority Level"]
		with self.assertRaises(IndexError):
			self.assertEqual(dataformatter.extract_seniority(o_P),-1)
			print("test assumes there's a next line after seniority level")
		
		o_P = ["Seniority Level","garbage"]
		self.assertEqual(dataformatter.extract_seniority(o_P),-1)
		
		o_P = ["Seniority level","Associate"]
		self.assertEqual(dataformatter.extract_seniority(o_P),"Associate")

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
		#Test and / &
		o_P = ["Industry","Electrical & Electronic Manufacturing  Computer Software  Automotive"]
		industries = dataformatter.extract_industry(o_P,dataformatter.linkedin_industries)
		self.assertEqual(set(industries),set(["Electrical & Electronic Manufacturing","Automotive","Computer Software"]))


if __name__ == '__main__':
	dataformatter = DataFormatter()
	unittest.main()
	
