import sys
import getopt
from selenium_navigation import Crawler

def main(argv):
    """
    arguments:
    -p --pages: scrapes the number of pages equal to the proceeding number. Defaults to 0.

    -j --jobs: scrapes UP TO this number of jobs per page. Defaults to 25.

    -o --output: creates an output of formatted data for testing stored in 'formatted.txt'

    -u --upload: disables or enables data upload. Defaults to true. Argument is <true> or <false>

    -h --head: defaults to false. if given, will NOT run in headless mode

    --help: prints this message
    """
    # The full list of jobs we scrape are:
    #            "Web Developer", "Systems Architect", "Database Administrator", "Dev Ops", "Security Analyst", 
    #            "IT Architect", "Data Scientist", "Software Engineer", "Firmware Engineer",
    #            "Data Engineer", "Machine Learning Engineer"

    # Keep track of user input values
    num_pages = 0
    num_jobs = 25
    headless = True 
    upload = True
    output = False

    # The list of jobs to be scraped.
    job_list = ["Web Developer", "Systems Architect", "Database Administrator", "Dev Ops", "Security Analyst", 
                "IT Architect", "Data Scientist", "Software Engineer", "Firmware Engineer",
                "Data Engineer", "Machine Learning Engineer"]
    # code to set up command line arguments
    options = "p:j:ou:h"
    long_options = ["pages=", "jobs=", "output", "upload=", "head", "help"]

    try:
        opts, args = getopt.getopt(argv, options, long_options)

    except getopt.GetoptError:
       print("Incorrect usage. Please use --help for more information")
       sys.exit(2)

    if(len(opts) == 0):
        print("Incorrect usage. Please use --help for more information")
        sys.exit(2)

    # Assigns command line arguments to variables  
    for opt, arg in opts:
        
        if(opt == '--help'):

            print(main.__doc__)
            sys.exit()

        elif opt in ("-p", "--pages"):
            num_pages = int(arg)

        elif opt in ("-j", "--jobs"):
            num_jobs = int(arg)

        elif opt in ("-o" "--output"):
            output = True

        elif opt in ("-u", "--upload"):
            if arg in ("True", "true", "t", "T"):
                upload = True
            elif arg in ("False", "false", "f", "F"):
                upload = False

        elif opt in ("-h, --head"):
                headless = False

    print("""now scraping {} pages, {} jobs per page. Current jobs we are scraping are {}.
            """.format(num_pages, num_jobs, job_list))

    # Create the crawler object 
    crawler = Crawler(headless)

    # Scrape the job list according to the command line arguments
    for job in job_list:
        print("Current job is {}".format(job))
        crawler.scrape_jobs(job, num_pages, num_jobs, output, upload)

    # End the crawling
    crawler.end_crawling()


# Pythonic main function
if __name__ == "__main__":
        main(sys.argv[1:])