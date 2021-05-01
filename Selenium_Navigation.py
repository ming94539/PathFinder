import pandas as pd
import re
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
import time
from Scraper import Scraper
browser = webdriver.Chrome("./chromedriver")
browser.set_window_size(1920, 1080)
browser.get("https://www.linkedin.com")
scraper = Scraper(is_headless = False)

username = browser.find_element_by_id("session_key")
username.send_keys("mjeng@ucsc.edu")
password = browser.find_element_by_id("session_password")
password.send_keys("CSE115Project")

login_button=browser.find_element_by_class_name("sign-in-form__submit-button")
login_button.click()

browser.get("https://www.linkedin.com/jobs")

time.sleep(5)
job_search_bar = browser.find_element_by_class_name("jobs-search-box__text-input")
job_search_bar.send_keys("Software Engineer")

time.sleep(2)


job_search_button = browser.find_element_by_class_name("jobs-search-box__submit-button")
job_search_button.click()
#Potential bug - not able to find element unless i manually inspect  - https://stackoverflow.com/questions/50698342/selenium-cant-find-elements-until-i-inspect-the-page

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
    # browser.implicitly_wait(10)
    #job_container = lxml_soup.find('ul', class_ = 'jobs-search-results__list')
    job_container = lxml_soup.find_all('li', class_ = 'jobs-search-results__list-item')
    time.sleep(3)

    print('You are scraping information about {} jobs.'.format(len(job_container)))

    id_list = []
    for job in job_container:
        job = str(job)
        numbers = re.findall(r'[0-9]+',job)
        for i in numbers:
            if len(i) == 10: #hardcoding that ID is always 10 digits")

                id_list.append(i)
                break


    lxml_soup = BeautifulSoup(browser.page_source, 'lxml')
    page_buttons = lxml_soup.find_all('li', class_ = 'artdeco-pagination__indicator')
    pg_num = 3
    pg_id = ""

    for page_button in page_buttons:
        target_button = "data-test-pagination-page-btn=\""+str(pg_num)+"\""
        if str(page_button).find(target_button) >= 0:
            id_i= str(page_button).find('id')
            #pg_id = str(page_buttons[1])[id_i+4:id_i+13]
            pg_id = "ember"+re.findall(r'%s(\d+)' % "ember", str(page_button))[0]
            print(pg_id)
            break

    next_button = browser.find_element_by_id(pg_id)
    next_button.click()
    current+=1

current_url = browser.current_url
start_index = current_url.index("?")

end_index = start_index

for i in range(10):
    to_scrape = current_url[:start_index] + "?currentJobId=" + id_list[i] + "&" + current_url[end_index:]
    
    print("current ID is {}".format(id_list[i]))
    scraper.get_page(to_scrape)
    scraper.scrape_linkedin()
scraper.end_scraping()
browser.quit()