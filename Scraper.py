from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from time import sleep
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from bs4 import BeautifulSoup


class Scraper:
	def __init__ (self, is_headless = True):
		#puts the browser in headless mode (no UI) if is_headless is true
		if is_headless: 
			self.current_options = Options()
			self.current_options.headless = True
			self.driver = webdriver.Chrome(options=self.current_options)
		#set the driver path
		else:
			self.driver = webdriver.Chrome()

	#navigates the scraper to a page at the given URL
	def get_page(self, url):
		self.driver.get(url)
		self.driver.implicitly_wait(5)
		sleep(10)
	#returns the title at the current page
	def get_title(self):
		return self.driver.title
	#simply eliminates this browser instance
	def end_scraping(self):
		self.driver.quit()
	#this scrapes the job details from a given Linkedin page
	def scrape_linkedin(self):
		self.driver.find_element_by_class_name("show-more-less-html__button").click()
		print(self.driver.find_element_by_class_name("description").text, file = open("output2.txt","w"))
		finder = BeautifulSoup(self.driver.page_source, 'html5lib')
		job_description = finder.find('div', 
									attrs= {'class': 'jobs-box__html-content jobs-description-content__text t-14 t-normal'})
		print(finder.prettify(), file = open("output.txt","w"))
		print(job_description)
		#text = job_description.get_text()



		return 


def main():
	test = Scraper(False)
	test.get_page('https://www.linkedin.com/jobs/search/?currentJobId=2500876429&start=0')
	test.scrape_linkedin()
	#test.end_scraping()

if __name__ == "__main__":
	main()