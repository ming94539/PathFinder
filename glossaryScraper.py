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
browser.get("https://glossarytech.com")
scraper = Scraper()

time.sleep(1)


pageSource = browser.page_source
lxml_soup = BeautifulSoup(pageSource, 'lxml')
time.sleep(2)
category_containers = lxml_soup.find_all('ul', class_ = 'accordion accordion_list js_accordion')
time.sleep(2)
#iterate and grab through all the category links

#iterate through every category link
    #iterate through every page
        #grab terms on every page


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
    time.sleep(2)
    # element = browser.find_element_by_id("ember665")
    # actions = ActionChains(driver)
    # actions.move_to_element(element).perform()
    # driver.execute_script("arguments[0].scrollIntoView();", element)
    # time.sleep(3)
    #browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    #Above doesn't seem to grab the entire html thing

    #print(job_container[0])
    print('You are scraping information about {} jobs.'.format(len(job_container)))

    id_list = []
    for job in job_container:
        job = str(job)
        numbers = re.findall(r'[0-9]+',job)
        for i in numbers:
            if len(i) == 10: #hardcoding that ID is always 10 digits
                id_list.append(i)
                break

#     print(id_list)
#     print(len(id_list))
#     for id in id_list: 
#         currUrl = browser.current_url
#         #firstHalf = driver.current_url.index('currentJobId=')+len('currentJobId=')
#         firstHalf = browser.current_url.index('?')
#         secondHalf = browser.current_url.index('keywords')
#     #     jobId = temp.find('a',href=True)['href']
#     #     jobId= jobId.split('/')[3]
#         newUrl = currUrl[:firstHalf] + '?currentJobId='+id+ '&'+ currUrl[secondHalf:]
#         job_links.append(newUrl)

#     print(job_links)
#     print(len(job_links))
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

for i in range(10):
	to_scrape = "https://www.linkedin.com/jobs/search/?currentJobId={}&keywords=software%20engineer&start=50".format(id_list[i])
	scraper.get_page(to_scrape)
	scraper.scrape_linkedin()
scraper.end_scraping()