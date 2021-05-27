import sys
import getopt
from Selenium_Navigation import Crawler

def main(argv):
    """
    arguments:
    -p --pages: scrapes the number of pages equal to the proceeding number
    -j --jobs: scrapes this number of jobs per page
    -o --output: creates an output of formatted data for testing
    -u --upload: defaults to true. arguement is <true> or <false>
    -h --head: defaults to false. if given, will NOT run in headless mode
    --help: prints this message
    """
    num_pages = 0
    num_jobs = 25
    headless = True 
    upload = True
    output = False
    job_list = ["Web Developer"]
    options = "p:j:ou:h"
    long_options = ["pages=", "jobs=", "output", "upload=", "head", "help"]

    try:
        opts, args = getopt.getopt(argv, options, long_options)

    except getopt.GetoptError:
       print("Incorrect usage. Please use --help for more information")
       sys.exit(2)
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


    crawler = Crawler(headless)

    for job in job_list:
        crawler.scrape_job(job, num_pages, num_jobs, output, upload)

    crawler.end_crawling()



if __name__ == "__main__":
        main(sys.argv[1:])