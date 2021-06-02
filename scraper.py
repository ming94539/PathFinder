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
        """
        Initializes the Scraper object with the given settings
        """

        #puts the browser in headless mode (no UI) if is_headless is true
        #sets up the proxy. NOTE that the proxy server can NOT be run if the
        #IP is not whitelisted on the proxy service site
        self.PROXY = "megaproxy.rotating.proxyrack.net:222"
        self.current_options = Options()
        self.current_options.add_argument('--proxy-server=%s' % self.PROXY)
        if is_headless: 
            self.current_options.headless = True
            
        #Set the driver path, depending on the OS, and create the webdriver.
        if(platform.system() == "Linux"):
            driver_path = "./chromedriver" 
        else:
            driver_path = "./macChromeDriver"
        self.driver = webdriver.Chrome(driver_path,options=self.current_options)
        self.driver.set_window_size(1920, 1080)

    def get_page(self, url):
        """
        Navigates the scraper to a given URL
        """

        #Sleep in order ot simulate user activity
        sleep_time = random.randint(1,6)
        sleep(sleep_time)

        #Error catching in the (incredibly rare) case of a ERR_TUNNEL_CONNECTION_FAILED exception
        do_retry = True
        num_retries = 0
        max_num_retries = 5
        while(do_retry == True and num_retries <= max_num_retries):
            #Attempts to navigate to the given URL. Retries 5 times in the case of a failure.
            try: 
                self.driver.get(url)
                break
            except(WebDriverException) as e:
                do_retry = True
                sleep(random.randint(1,60))
                num_retries = num_retries + 1
                continue
        #Update the current URL
        self.current_url = url
        sleep(2)
   
    def get_title(self):
        """
        Returns the current URL of the page.
        """
        return self.driver.title
    
    def end_scraping(self):
        """
        Quits the web driver
        """    
        self.driver.quit()
    
    def scrape_linkedin(self):
        """
        Retrieves the raw text of the linkedin job description and returns it
        """
        #Check if the description exists for error handling. If it doesn't, reload the page until it does
        description_exists = self.check_element("description")
        if(description_exists != True):
            max_num_retries = 5
            num_retries = 0
            while(description_exists != True and num_retries < max_num_retries):
                print("error loading page, retrying... {} more times".format(max_num_retries-num_retries))
                num_retries = num_retries + 1
                sleep(random.randint(1,60))
                self.get_page(self.current_url)
                description_exists = self.check_element("description")

        #First, check if the button exists. Then check if it is clickable. If it isn't, simply
        #continue
        if(self.check_element("show-more-less-html__button")):
            is_clicked = self.try_click("show-more-less-html__button")
            if(is_clicked != True):
                print("Click unsuccessful, check logs")
        return self.driver.find_element_by_class_name("description").text

    #from stackoverflow question 47791232
    def check_element(self,element):
        """
        Checks if an element exists based on HTML class names
        """
        try:
            self.driver.find_element_by_class_name(element)
            return True
        except(NoSuchElementException) as e:
            return False
    def try_click(self, element):
        """
        Checks if a button is clickable based on HTML class name
        """
        try:
            self.driver.find_element_by_class_name(element).click()
            return True
        except(ElementNotInteractableException) as e:
            return False