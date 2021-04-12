from selenium import webdriver
from selenium.webdriver.chrome.options import options


#Code here used from https://www.scrapingbee.com/blog/selenium-python/

#set the options to run in headless, so no GUI
options = Options()
options.headless = True
options.add_argument("--window-size=1920,1200")

#set the driver path
DRIVER_PATH = './chromedriver.exe'
driver = webdriver.Chrome(executable_path=DRIVER_PATH)

#TODO: integrate this so the url here is dynamic. for current purposes,
#This will just do one page. We will make it dynamic in the future.
driver.get('https://google.com')

print(driver.page_source)
driver.quit()