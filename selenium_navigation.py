import pandas as pd
import re
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
from scraper import Scraper
from sqlalchemy import create_engine, text
import pprint
from data_formatter import DataFormatter
import platform


class Crawler:
    
    def __init__(self, is_headless = True):
        """
        Initializes values for the scraper, as well as values used for
        Accessing the database through sqlalchemy
        """

        # Returns initialized sqlalchemy engine for db access
        user="acraig1225"
        pw="#$%cse115a#$%"
        host="highlanderdb.cjnqiycyzhsl.us-east-2.rds.amazonaws.com"
        db_name="testing"
        conn_string = f"postgresql://{user}:{pw}@{host}/{db_name}"
        self.engine = create_engine(conn_string)

        # Initialize the browser, and set up output files
        self.browser = self.init_browser(is_headless = is_headless)
        self.scraper = Scraper(is_headless = is_headless)
        self.formatter = DataFormatter()
        self.output_file = open("results.txt","a+")
        self.formatted_output = open("formatted.txt","a")
        
    def is_duplicate_id(self, id):
        """
        Queries the database to check if a job ID already exists. Returns true if the
        JobID is a duplicate
        """
        #Set up the query
        query = f'''
            SELECT jobID
            FROM JobIDTable
            WHERE jobID = '{id}'
        '''
        #Send the query and return the proper value
        result = self.engine.execute(text(query))
        if result.rowcount > 0:
            print("duplicate id found:", id)
            return True

        return False
            
    def init_browser(self, is_headless):
        """ 
        Initializes the web driver with proper settings, and logs into the LinkedIn 
        webpage    
        """

        # create options object for setting the webcrawler into headless mode
        current_options = Options()
        if is_headless:     
            current_options.headless = True
        # Check the system and use the proper webdriver. Only works on Linux and Mac
        if(platform.system() == "Linux"):
            driver_path = "./chromedriver" 
        else:
            driver_path = "./macChromeDriver"
        
        # Start the crawler and log into LinkedIn
        browser = webdriver.Chrome(driver_path, options = current_options)
        browser.set_window_size(1920, 1080)
        browser.get("https://www.linkedin.com")
        username = browser.find_element_by_id("session_key")
        username.send_keys("mjeng@ucsc.edu")
        password = browser.find_element_by_id("session_password")
        password.send_keys("CSE115Project")

        login_button=browser.find_element_by_class_name("sign-in-form__submit-button")
        login_button.click()

        # Navigate to the jobs page, and return the browser object.
        browser.get("https://www.linkedin.com/jobs")
        return browser

    def scrape_jobs(self, job_name, num_pages, num_jobs = 25, print_results = False, do_upload= True):
        """
        This function scrapes the jobposts with the given parameters, and creates and uses the data
        formatting class.
        """
        #There are periodic waits throughout the code. This is to allow the full HTML to load, as well as to simulate
        #Human web-browsing behavior. 
        time.sleep(5)
        #locate the search bar, and search the job title
        job_search_bar = self.browser.find_element_by_class_name("jobs-search-box__text-input")
        job_search_bar.clear()
        job_search_bar.send_keys(job_name)
        time.sleep(2)
        job_search_button = self.browser.find_element_by_class_name("jobs-search-box__submit-button")
        job_search_button.click()
        
        #set up iteration variables for the while loop
        pg_num = 1 # current page number
        id_list = [] # empty list of jobIDs
        max_pages = 40 # The maximum number of pages that the crawler can scrape

        while pg_num <= num_pages and pg_num <= max_pages:
            # ------------------ Scraping the Linkedin Job Webpage's left rail (it's a two pane wrapper)
            # parsing the visible webpage
            pageSource = self.browser.page_source
            time.sleep(2)
            lxml_soup = BeautifulSoup(pageSource, "lxml")
            time.sleep(2)

            # find all jobs on the page
            job_container = lxml_soup.find_all("li", class_ = "jobs-search-results__list-item")
            time.sleep(3)

            print("You are scraping information about {} jobs.".format(len(job_container)))

            #This block stores every jobID found on the page
            for job in job_container:
                job = str(job)
                numbers = re.findall(r"[0-9]+",job)
                for i in numbers:
                    if len(i) == 10: #hardcoding that ID is always 10 digits")

                        id_list.append(i)
                        break 

            #This is used for advancing the crawler to the next page
            lxml_soup = BeautifulSoup(self.browser.page_source, "lxml")
            page_buttons = lxml_soup.find_all("li", class_ = "artdeco-pagination__indicator")
            
            pg_id = ""

            for page_button in page_buttons:
                target_button = "data-test-pagination-page-btn=\""+str(pg_num)+"\""
                exception_button = "aria-label=\"Page "+str(pg_num)+"\"" #Used in a corner case that occurs on page 9
                if str(page_button).find(target_button) >= 0 or str(page_button).find(exception_button) >= 0:
                    pg_id = "ember"+re.findall(r"%s(\d+)" % "ember", str(page_button))[0]
                    break

            #Increment loop variables and click to the next page.
            pg_num += 1
            next_button = self.browser.find_element_by_id(pg_id)
            next_button.click()
            
            #Variables used for constructing a full URL for webscraping
            current_url = self.browser.current_url
            start_index = current_url.index("?")
            end_index = start_index
            #Set the proper number of jobs to scrape based on input
            num_to_scrape = min(len(id_list), num_jobs)
            for i in range(num_to_scrape):
                job_id = id_list[i]
                #Constructs a URL to send to the scraper, and then calls the scraper function
                if not self.is_duplicate_id(job_id):
                    print("current ID is {}".format(job_id))
                    to_scrape = current_url[:start_index] + "?currentJobId=" + job_id + "&" + current_url[end_index:]
                    self.scraper.get_page(to_scrape)
                    result = self.scraper.scrape_linkedin()

                    # Print to the results file
                    print("BREAK{}".format(job_id), file = self.output_file)
                    print(result, file = self.output_file)
            # Configure the output file and send it to the formatter, print the results if needed.
            self.output_file.seek(0)
            self.formatter.preprocessing(self.output_file)
            output = self.formatter.data_extraction(job_name, do_upload)
            if(print_results):
                pprint.pprint(output, stream = self.formatted_output)
            #clear the ID list and output file for the next iteration
            self.output_file.truncate(0)
            id_list = []

    def end_crawling(self):
        """
        Deinstantiates the web drivers for bother the scraper and the crawler.
        """
        self.scraper.end_scraping()
        self.browser.quit()
