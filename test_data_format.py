
'''
1. Abbreviation - B.A. B.S. - after my punctuation remover, it becomes B A B S. Making it miss stuff
2. Tokenization - Miss key words with two or more words like "React Native"
3. Double spaces - not completely sure yet but I think it's from the punctuation remover, but 
the regex that removes multiple consecutive spaces can deal with that
'''


import re
from nltk.tokenize import word_tokenize 

class DataFormatter
    #Seperate Job Posts, put them all in a list, with each element a job post
    #Preprocessing like removing punctuations, lowercase everything
    def __init__(self, jobs_file):
        self.jobs_file = jobs_file

    def preprocessing(jobs_file):
        jobsFile = open(jobs_file)
        jobslines = jobsFile.readlines()
        origPosts = []
        jobPosts = []
        post = ""
        origPost = ""
        firstOne = True
        for l in range(len(jobslines)):
            if jobslines[l] == "BREAK\n":
                if firstOne:
                    firstOne = False
                else:
                    jobPosts.append(post)
                    origPosts.append(origPost)
                    post = ""
                    origPost = ""
                continue
            origPost += jobslines[l]
            if l == len(jobslines)-1:
                jobPosts.append(post)
                origPosts.append(origPost)
           # post += jobslines[l].replaceAll("[\\p{Punct}&&[^.]]", "").lower();
            post+= re.sub(r'[^\w\s]', ' ', jobslines[l].lower())

        print('----')
        for p in range(len(jobPosts)):
            jobPosts[p]= re.sub(' +', ' ', jobPosts[p].replace('\n',' ')) #remove unnecessary double/triple white space
        # for p in range(len(jobPosts)):
        #     jobPosts[p] = word_tokenize(jobPosts[p])
        return origPosts, jobPosts


    def read_termsFile(termsFile):
        termsFile = open(termsFile,"r")
        terms = termsFile.readlines()
        print('number of tech terms',len(terms))
        keywords = [term.rstrip('\n').lower() for term in terms]
        return keywords





    def extract_seniority(o_P):
        seniority_levels = ['Internship','Entry level','Associate','Mid-Senior level','Director','Executive','Not Applicable']
        s_tag = ""
        s_boo =False
        #Some weird inconsistency with linkedin seniority level upperlower caseness, edge case
        if "Seniority Level" in o_P:
            s_tag = "Seniority Level"
            s_boo = True
        elif "Seniority level" in o_P:
            s_tag = "Seniority level"
            s_boo = True
        if s_boo:
            seniorityIndex = o_P.index(s_tag) +1 
            if o_P[seniorityIndex] in seniority_levels:
                print('SENIORITY:', seniority_levels[seniority_levels.index(o_P[seniorityIndex])])

    def extract_degree_lvl(post):
        deg_lvls = []
        deg_lvl = {
                   'a':['associate\'s','associate degree'],
                   'b':['ba','bs','bachelor','bachelor\'s','b s'],
                   'm':['master','ms','master\'s','m s'],
                   'p':['ph d','phd']

        }
        for d_key, d_value in deg_lvl.items():
            for variation in d_value:
                variation = " "+variation+" "
                if variation in post:
                    deg_lvls.append(d_key)
        print('EDUCATION LEVEL',set(deg_lvls))
        
    def extract_degree_title(post):
        deg_titles = []
        deg_title = {'cs':['computer science','cs','c s'],
                     'ce':['computer engineering','ce','c e'],
                      'ee':['electrical engineering','ee','e e']

        }

        for d_key, d_value in deg_title.items():
            for title in d_value:
                title = " "+title+" "
                if title in post:
                    deg_titles.append(d_key)
           
        print('DEGREE TITLE', set(deg_titles))

    def extract_tech_terms(post,keywords):
        skills = []
        for key in keywords:
            key= " "+key+" "
            if key in post:
                skills.append(key.strip())
        print('SKILLS',set(skills))
        
    def extract_industry(o_P):
        linkedin_industries = open("linkedin_industries.txt",'r').read().split('\n')
        s_tag = ""
        s_boo =False
        industries = []
        #Some weird inconsistency with inconsistency industry(ies) plural/singular, edge case
        if "Industry" in o_P:
            s_tag = "Industry"
            s_boo = True
        elif "Industries" in o_P:
            s_tag = "Industries"
            s_boo = True
        if s_boo:
            industryIndex = o_P.index(s_tag) +1 
            for ind in linkedin_industries:
                if ind in o_P[industryIndex] or ind.replace("&","and") in o_P[industryIndex]:
                    industries.append(ind)
            print('INDUSTRIES:', industries)
    def extract_yoe(post):
        tokenize = post.split(' ')
        yoe_variation = ['years of experience','years of full time','years full time','years industry experience','years of industry experience','years work experience','years of work experience']
        for w in range(len(tokenize)):
            if tokenize[w].isdigit():
                #print(tokenize[w-5:w],tokenize[w],tokenize[w+1:w+5])
                for yv in yoe_variation:
                    if yv in ' '.join(tokenize[w:w+6]):
                        print('YOE:', tokenize[w])
                        return
        print('YOE:','N/A')


    def data_extraction(origPosts, jobPosts,keywords):    

        for i in range(len(jobPosts)):           
            o_P = origPosts[i].split('\n')
            #SENIORITY
            extract_seniority(o_P)
            #INDUSTRY
            extract_industry(o_P)
            #Keyword Extraction -----
            #TECH SKILLS
            extract_tech_terms(jobPosts[i], keywords)
            #Degree level
            extract_degree_lvl(jobPosts[i])
            #DEGREE TITLE
            extract_degree_title(jobPosts[i])
            #YoE
            extract_yoe(jobPosts[i])
            print()
    

orig_posts, jobPosts = preprocessing("sample_jobposts.txt")
keywords = read_termsFile("final_keywords.txt")
data_extraction(orig_posts, jobPosts, keywords)

