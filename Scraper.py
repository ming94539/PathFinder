from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from time import sleep
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from bs4 import BeautifulSoup
from selenium.common.exceptions import NoSuchElementException
import random
class Scraper:
	def __init__ (self, is_headless = True):
		#puts the browser in headless mode (no UI) if is_headless is true
		if is_headless: 
			self.current_options = Options()
			self.current_options.headless = True
			self.driver = webdriver.Chrome("./chromedriver",options=self.current_options)
		#set the driver path
		else:
			self.driver = webdriver.Chrome("./chromedriver")
		self.driver.set_window_size(1920, 1080)

	#navigates the scraper to a page at the given URL
	def get_page(self, url):
		sleep_time = random.randint(1,61)
		sleep(sleep_time)
		self.driver.get(url)
		self.driver.implicitly_wait(5)
		sleep(2)
	#returns the title at the current page
	def get_title(self):
		return self.driver.title
	#simply eliminates this browser instance
	def end_scraping(self):
		self.driver.quit()
	#this scrapes the job details from a given Linkedin page
	def scrape_linkedin(self):
		if(self.check_element("show-more-less-html__button")):
			self.driver.find_element_by_class_name("show-more-less-html__button").click()

		print(self.driver.find_element_by_class_name("description").text, file = open("results.txt","a"))
		return 

	#from stackoverflow question 47791232
	def check_element(self,element):
		try:
			self.driver.find_element_by_class_name(element)
			return True
		except(NoSuchElementException) as e:
			return False
