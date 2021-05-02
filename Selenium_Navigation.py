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

#create the browser in headles smode
current_options = Options()
current_options.headless = True
browser = webdriver.Chrome("./chromedriver",options=current_options)
browser.set_window_size(1920, 1080)

#go to the linkedIn login site
browser.get("https://www.linkedin.com")

#create the scraper
scraper = Scraper()

#log in at the linked in sign-in page
username = browser.find_element_by_id("session_key")
username.send_keys("mjeng@ucsc.edu")
password = browser.find_element_by_id("session_password")
password.send_keys("CSE115Project")

login_button=browser.find_element_by_class_name("sign-in-form__submit-button")
login_button.click()

#go to the jobs page
browser.get("https://www.linkedin.com/jobs")

#wait, and then find the search box and search for a term (software engineering for right now)
time.sleep(5)
job_search_bar = browser.find_element_by_class_name("jobs-search-box__text-input")
job_search_bar.send_keys("Software Engineer")

job_search_button = browser.find_element_by_class_name("jobs-search-box__submit-button")
job_search_button.click()
#Potential bug - not able to find element unless i manually inspect  - https://stackoverflow.com/questions/50698342/selenium-cant-find-elements-until-i-inspect-the-page

#create an ID list and prepare to parse 4 pages of links
id_list = []

pages = 4
current = 0
while current < pages:
    # ------------------ Scraping the Linkedin Job Webpage's left rail (it's a two pane wrapper)
     # parsing the visible webpage
    pageSource = browser.page_source
    time.sleep(2)
    lxml_soup = BeautifulSoup(pageSource, 'lxml')
    time.sleep(2)

    job_container = lxml_soup.find_all('li', class_ = 'jobs-search-results__list-item')
    time.sleep(3)

    print('You are scraping information about {} jobs.'.format(len(job_container)))

    #grab job IDs for the page and put them in the ID list
    id_list = []
    for job in job_container:
        job = str(job)
        numbers = re.findall(r'[0-9]+',job)
        for i in numbers:
            if len(i) == 10: #hardcoding that ID is always 10 digits")

                id_list.append(i)
                break

    #Find the next page button and click it
    lxml_soup = BeautifulSoup(browser.page_source, 'lxml')
    page_buttons = lxml_soup.find_all('li', class_ = 'artdeco-pagination__indicator')
    pg_num = 3
    pg_id = ""

    for page_button in page_buttons:
        target_button = "data-test-pagination-page-btn=\""+str(pg_num)+"\""
        if str(page_button).find(target_button) >= 0:
            id_i= str(page_button).find('id')
            
            pg_id = "ember"+re.findall(r'%s(\d+)' % "ember", str(page_button))[0]
            print(pg_id)
            break

    next_button = browser.find_element_by_id(pg_id)
    next_button.click()
    current+=1

# Create the url with some string operations
current_url = browser.current_url
start_index = current_url.index("?")

end_index = start_index

#iterate through 10 urls, print them to a results file
for i in range(10):
    to_scrape = current_url[:start_index] + "?currentJobId=" + id_list[i] + "&" + current_url[end_index:]
    
    print("current ID is {}".format(id_list[i]))
    scraper.get_page(to_scrape)
    scraper.scrape_linkedin()
scraper.end_scraping()
browser.quit()