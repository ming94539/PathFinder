import pandas as pd
import re
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
from Scraper import Scraper
from sqlalchemy import create_engine, text
import pprint
from data_formatter import DataFormatter
class Crawler:
    
    def __init__(self, is_headless = False):
        # Returns initialized sqlalchemy engine for db access
        user='acraig1225'
        pw='#$%cse115a#$%'
        host='highlanderdb.cjnqiycyzhsl.us-east-2.rds.amazonaws.com'
        db_name='testing'
        conn_string = f"postgresql://{user}:{pw}@{host}/{db_name}"
        self.engine = create_engine(conn_string)
        self.browser = self.init_browser(is_headless = is_headless)
        self.scraper = Scraper(is_headless = is_headless)
        self.formatter = DataFormatter("final_keywords.txt")
        self.output_file = open("results.txt","a+")
        self.formatted_output = open("formatted.txt","a")

    # Return True if id exists in db, False otherwise
    def is_duplicate_id(self, id):
        query = f'''
            SELECT jobID
            FROM JobIDTable
            WHERE jobID = {id}
        '''
        # query = f'''
        #     SELECT test_id
        #     FROM Test
        #     WHERE test_id = '{id}'
        # '''
        result = self.engine.execute(text(query))
        if result.rowcount > 0:
            print('duplicate id found:', id)
            return True

        return False
            

    # Returns new Chrome driver ready to scrape linkedin
    def init_browser(self, is_headless):
        current_options = Options()
        if is_headless:     
            current_options.headless = True

        browser = webdriver.Chrome("./chromedriver", options = current_options)
        browser.set_window_size(1920, 1080)
        browser.get("https://www.linkedin.com")

        username = browser.find_element_by_id("session_key")
        username.send_keys("mjeng@ucsc.edu")
        password = browser.find_element_by_id("session_password")
        password.send_keys("CSE115Project")

        login_button=browser.find_element_by_class_name("sign-in-form__submit-button")
        login_button.click()

        browser.get("https://www.linkedin.com/jobs")
        return browser

    # Scrapes results given by using `job` as the search term
    def scrape_job(self, job_name, num_pages, num_jobs = 25):
        
        time.sleep(5)
        job_search_bar = self.browser.find_element_by_class_name("jobs-search-box__text-input")
        job_search_bar.clear()
        job_search_bar.send_keys(job_name)
        

        time.sleep(2)

        job_search_button = self.browser.find_element_by_class_name("jobs-search-box__submit-button")
        job_search_button.click()
        #Potential bug - not able to find element unless i manually inspect  - https://stackoverflow.com/questions/50698342/selenium-cant-find-elements-until-i-inspect-the-page


        current = 0
        id_list = []
        while current < num_pages:
            # ------------------ Scraping the Linkedin Job Webpage's left rail (it's a two pane wrapper)
            # parsing the visible webpage
            pageSource = self.browser.page_source
            time.sleep(2)
            lxml_soup = BeautifulSoup(pageSource, 'lxml')
            time.sleep(2)

            # find all jobs on the page
            job_container = lxml_soup.find_all('li', class_ = 'jobs-search-results__list-item')
            time.sleep(3)

            print('You are scraping information about {} jobs.'.format(len(job_container)))

            
            for job in job_container:
                job = str(job)
                numbers = re.findall(r'[0-9]+',job)
                for i in numbers:
                    if len(i) == 10: #hardcoding that ID is always 10 digits")

                        id_list.append(i)
                        break

            lxml_soup = BeautifulSoup(self.browser.page_source, 'lxml')
            page_buttons = lxml_soup.find_all('li', class_ = 'artdeco-pagination__indicator')
            pg_num = 3
            pg_id = ""

            for page_button in page_buttons:
                target_button = "data-test-pagination-page-btn=\""+str(pg_num)+"\""
                if str(page_button).find(target_button) >= 0:
                    id_i= str(page_button).find('id')
                    #pg_id = str(page_buttons[1])[id_i+4:id_i+13] 
                    pg_id = "ember"+re.findall(r'%s(\d+)' % "ember", str(page_button))[0]
                    # print(pg_id)
                    break

            next_button = self.browser.find_element_by_id(pg_id)
            next_button.click()
            current+=1
        
        current_url = self.browser.current_url
        start_index = current_url.index("?")

        end_index = start_index

        if(num_jobs <= len(id_list)):
            num_to_scrape = num_jobs
        else:
            num_to_scrape = len(id_list)

        for i in range(num_to_scrape):

            job_id = id_list[i]

            # if not self.is_duplicate_id(job_id):
            print("current ID is {}".format(job_id))
            to_scrape = current_url[:start_index] + "?currentJobId=" + job_id + "&" + current_url[end_index:]
            
            self.scraper.get_page(to_scrape)
            result = self.scraper.scrape_linkedin()

            # For now, (until we get data formatting finished)
            # insert first 20 chars into Test table
            # insert = f''' 
            #     INSERT INTO Test (test_id, text)
            #     VALUES ({job_id}, '{result[:20]}')
            # '''
            # self.engine.execute(text(insert))

            # print to a results file
            print("BREAK{}".format(job_id), file = self.output_file)
            print(result, file = self.output_file)
        self.output_file.seek(0)
        self.formatter.preprocessing(self.output_file)
        print(job_name)
        output = self.formatter.data_extraction(job_name)
        pprint.pprint(output, stream = self.formatted_output)
        self.output_file.truncate(0)

    def end_crawling(self):
        self.scraper.end_scraping()
        self.browser.quit()

def main():
    job_list = ['Web Developer']

    crawler = Crawler(is_headless = False)

    for job in job_list:
        crawler.scrape_job(job, 2, 10)

    crawler.end_crawling()

if __name__ == '__main__':
    main()
