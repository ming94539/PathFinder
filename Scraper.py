from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from time import sleep
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from bs4 import BeautifulSoup
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import WebDriverException
from selenium.common.exceptions import ElementNotInteractableException
import random
import platform
class Scraper:

    def __init__ (self, is_headless = True):
        #puts the browser in headless mode (no UI) if is_headless is true
        #sets up the proxy. NOTE that the proxy server can NOT be run if the
        #IP is not whitelisted on the proxy service site
        self.PROXY = "megaproxy.rotating.proxyrack.net:222"
        self.current_options = Options()
        #self.chrome_options = WebDriver.ChromeOptions()
        self.current_options.add_argument('--proxy-server=%s' % self.PROXY)
        if is_headless: 
            
            self.current_options.headless = True
            
        #set the driver path
        if(platform.system() == "Linux"):
            driver_path = "./chromedriver" 
        else:
            driver_path = "./macChromeDriver"
        self.driver = webdriver.Chrome(driver_path,options=self.current_options)
        self.driver.set_window_size(1920, 1080)

    #navigates the scraper to a page at the given URL
    def get_page(self, url):
        sleep_time = random.randint(1,11)
        sleep(sleep_time)
        do_retry = True
        num_retries = 0
        while(do_retry == True and num_retries <= 5):
            try: 
                self.driver.get(url)
                break
            except(WebDriverException) as e:
                do_retry = True
                sleep(random.randint(1,60))
                num_retries = num_retries + 1
                continue

        self.current_url = url
        sleep(2)
    #returns the title at the current page
    def get_title(self):
        return self.driver.title
    #simply eliminates this browser instance
    def end_scraping(self):
        self.driver.quit()
    #this scrapes the job details from a given Linkedin page
    def scrape_linkedin(self):

        description_exists = self.check_element("description")
        if(description_exists != True):
            # print("error loading page, retrying...")
            max_num_retries = 5
            num_retries = 0
            while(description_exists != True and num_retries < max_num_retries):
                print("error loading page, retrying... {} more times".format(max_num_retries-num_retries))
                num_retries = num_retries + 1
                sleep(random.randint(1,60))
                self.get_page(self.current_url)
                description_exists = self.check_element("description")
        if(self.check_element("show-more-less-html__button")):
            is_clicked = self.try_click("show-more-less-html__button")
            if(is_clicked != True):
                print("Click unsuccessful, check logs")
        return self.driver.find_element_by_class_name("description").text

        # print(self.driver.find_element_by_class_name("description").text, file = open("results.txt","a"))
        # return 

    #from stackoverflow question 47791232
    def check_element(self,element):
        try:
            self.driver.find_element_by_class_name(element)
            return True
        except(NoSuchElementException) as e:
            return False
    def try_click(self, element):
        try:
            self.driver.find_element_by_class_name(element).click()
            return True
        except(ElementNotInteractableException) as e:
            return False