import re
from nltk.tokenize import word_tokenize 
from databaseUpload import db_uploadFunction

class DataFormatter:
    def __init__(self, termsFile = "lists/final_keywords2.txt", 
                    languages = "lists/topLanguages.txt", 
                    industries = "lists/linkedin_industries.txt"):
        self.keywords = self.read_termsFile(termsFile)
        self.languages = self.read_termsFile(languages)
        self.linkedin_industries = open(industries,'r').read().split('\n')

    def preprocessing(self,jobs_file):
        
        # jobsFile = open(jobs_file)
        jobslines = jobs_file.readlines()
        self.origPosts = []
        self.jobPosts = []
        self.id_list = []
        post = ""
        origPost = ""
        firstOne = True
        
        for l in range(len(jobslines)):
            if "BREAK" in jobslines[l]:
                self.id_list.append(int(jobslines[l][5:]))
                if firstOne:
                    firstOne = False
                else:
                    self.jobPosts.append(post)
                    self.origPosts.append(origPost)
                    post = ""
                    origPost = ""
                continue
            origPost += jobslines[l]
            if l == len(jobslines)-1:
                self.jobPosts.append(post)
                self.origPosts.append(origPost)
           # post += jobslines[l].replaceAll("[\\p{Punct}&&[^.]]", "").lower();
            post+= re.sub(r'[^\w\s\+]', ' ', jobslines[l].lower())

        print('----')
        for p in range(len(self.jobPosts)):
            self.jobPosts[p]= re.sub(' +', ' ', self.jobPosts[p].replace('\n',' ')) #remove unnecessary double/triple white space
        # for p in range(len(jobPosts)):
        #     jobPosts[p] = word_tokenize(jobPosts[p])
        # return origPosts, jobPosts, id_list

    
    def read_termsFile(self, termsFileName):
        '''
        @Input the path of the file to be opened
        @Output return a list with each element a line in the file
        '''
        termsFile = open(termsFileName,"r")
        terms = termsFile.readlines()
        print('opened:',termsFileName)
        print('number terms:',len(terms))
        keywords = [term.rstrip('\n').lower() for term in terms]
        termsFile.close()
        return keywords

    #
    def extract_seniority(self, o_P):
        '''
        @Input list of strings o_P may contain a line "Seniority Level" (Linkedin Post attribute)
        @Output return the seniority level (standarlized) if there is one, the element (next line) after "Seniority Level" 
        '''
        seniority_levels = ['Internship','Entry level','Associate','Mid-Senior level','Director','Executive']
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
                #print('SENIORITY:', seniority_levels[seniority_levels.index(o_P[seniorityIndex])])
                return seniority_levels[seniority_levels.index(o_P[seniorityIndex])]
            elif o_P[seniorityIndex] == "Not Applicable":
                return -1
            else:
                print("Doesn't exist in Linkedin's standard seniority levels, weird.")
                return -1
        else:
            return -1

    def extract_degree_lvl(self, post):
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
        #print('EDUCATION LEVEL',set(deg_lvls))
        return list(set(deg_lvls))
        
    def extract_degree_title(self, post):
        deg_titles = []
        deg_title = {'computer science':['computer science','cs','c s'],
                     'computer engineering':['computer engineering','ce','c e'],
                      'electrical engineering':['electrical engineering','ee','e e'],
                     'applied math':['applied math','applied mathematics'],
                     'physics':['physics'],
                     'statistics':['statistics'],
                     'bioinformatics/comp-bio':['bioinformatics','computational biology']

        }

        for d_key, d_value in deg_title.items():
            for title in d_value:
                title = " "+title+" "
                if title in post:
                    deg_titles.append(d_key)
           
       #print('DEGREE TITLE', set(deg_titles))
        return list(set(deg_titles))

    def extract_tech_terms(self, post,keywords):
        skills = []
        for key in keywords:
            key= " "+key+" "
            if key in post:
                skills.append(key.strip())
       #print('SKILLS',set(skills))
        return list(set(skills))

    def extract_languages(self, post,languages):
        '''
        @Input ASSUMES that the a language won't appear as the first or last word, the occurence of that happening
        is very not likely (these job posts always have starting/ending words), so didn't put in the case to handle
        otherwise
        '''
        lang = []
        for key in languages:
            key2= " "+key+" "
            if key2 in post:
                lang.append(key2.strip())
            elif (key in post) and (post.index(key) == 0 or post.index(key) == len(post)-len(key)):
                #the first word or last word
                lang.append(key)
       #print('SKILLS',set(skills))
        return list(set(lang))


    def extract_industry(self, o_P,linkedin_industries):

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
            #print('INDUSTRIES:', industries)
            return industries
        else:
            return []
    def extract_yoe(self, post):
        tokenize = post.split(' ')
        yoe_variation = ['years of experience',
        'years of full time','years full time',
        'years industry experience','years of industry experience',
        'years work experience','years of work experience']
        for w in range(len(tokenize)):
            if tokenize[w].isdigit():
                #print(tokenize[w-5:w],tokenize[w],tokenize[w+1:w+5])
                for yv in yoe_variation:
                    if yv in ' '.join(tokenize[w:w+6]):
                        #print('YOE:', tokenize[w])
                        return int(tokenize[w])
        #print('YOE:','N/A')
        return -1


    def data_extraction(self, job_name):  
        '''
        @Input self.jobPosts is a list of strings. Each job post is a long string with each word 
        lower cased. Punctuations are removed.
        '''      
        output = {}
        for i in range(len(self.jobPosts)):  
            output[self.id_list[i]] = {}
            o_P = self.origPosts[i].split('\n')
            #SENIORITY
            output[self.id_list[i]]['seniority']=self.extract_seniority(o_P)
            #INDUSTRY
            output[self.id_list[i]]['industry']=self.extract_industry(o_P,self.linkedin_industries)
            #Keyword Extraction -----
            #Languages
            output[self.id_list[i]]['languages'] = self.extract_languages(self.jobPosts[i],self.languages)
            #TECH SKILLS
            output[self.id_list[i]]['skills']= self.extract_tech_terms(self.jobPosts[i], self.keywords)
            #Degree level
            output[self.id_list[i]]['educationLevel'] = self.extract_degree_lvl(self.jobPosts[i])
            #DEGREE TITLE
            output[self.id_list[i]]['degreeTitle'] = self.extract_degree_title(self.jobPosts[i])
            #YoE
            output[self.id_list[i]]['yoe']= self.extract_yoe(self.jobPosts[i])
            print()
            #Do the Data Base Upload and data validation
            dbup_table = output[self.id_list[i]].copy()
            dbup_table['jobID'] = self.id_list[i]

            dbup_table['table'] = job_name.replace(" ", "")
            print(db_uploadFunction(dbup_table))
        return output
    


# orig_posts, jobPosts, id_list = preprocessing("sample_jobposts.txt")
# print('There\'s',len(jobPosts), 'job posts')
# keywords = read_termsFile("lists/final_keywords2.txt")
# languages = read_termsFile("lists/topLanguages.txt")
# linkedin_industries = open("lists/linkedin_industries.txt",'r').read().split('\n')
# print('opened lists/linkedin_industries.txt:\nnumber of terms',len(linkedin_industries))
# output = data_extraction(orig_posts, jobPosts, keywords,id_list,linkedin_industries,languages)
# import pprint

#pprint.pprint(output)
