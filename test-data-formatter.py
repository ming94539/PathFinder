
import re
from nltk.tokenize import word_tokenize 


#Seperate Job Posts, put them all in a list, with each element a job post
#Preprocessing like removing punctuations, lowercase everything
def preprocessing(jobs_file):
    jobsFile = open(jobs_file)
    jobslines = jobsFile.readlines()
    origPosts = []
    jobPosts = []
    id_list = []
    post = ""
    origPost = ""
    firstOne = True
    for l in range(len(jobslines)):
        if "BREAK" in jobslines[l]:
            id_list.append(int(jobslines[l][5:]))
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
        post+= re.sub(r'[^\w\s]', ' ', jobslines[l].lower())

    print('----')
    for p in range(len(jobPosts)):
        jobPosts[p]= re.sub(' +', ' ', jobPosts[p].replace('\n',' ')) #remove unnecessary double/triple white space

    return origPosts, jobPosts, id_list



def read_termsFile(termsFileName):
    termsFile = open(termsFileName,"r")
    terms = termsFile.readlines()
    print('opened:',termsFileName)
    print('number terms:',len(terms))
    keywords = [term.rstrip('\n').lower() for term in terms]
    return keywords



def extract_seniority(o_P):
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
            return "N/A"
        else:
            print("Doesn't exist in seniority levels, weird.")
            return "N/A"
    else:
        return "N/A"

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
    #print('EDUCATION LEVEL',set(deg_lvls))
    return list(set(deg_lvls))
    
def extract_degree_title(post):
    deg_titles = []
    deg_title = {'cs':['computer science','cs','c s'],
                 'ce':['computer engineering','ce','c e'],
                  'ee':['electrical engineering','ee','e e'],

    }

    for d_key, d_value in deg_title.items():
        for title in d_value:
            title = " "+title+" "
            if title in post:
                deg_titles.append(d_key)
       
   #print('DEGREE TITLE', set(deg_titles))
    return list(set(deg_titles))

def extract_tech_terms(post,keywords):
    skills = []
    for key in keywords:
        key= " "+key+" "
        if key in post:
            skills.append(key.strip())
   #print('SKILLS',set(skills))
    return list(set(skills))

def extract_languages(post,languages):
    lang = []
    for key in languages:
        key= " "+key+" "
        if key in post:
            lang.append(key.strip())
   #print('SKILLS',set(skills))
    return list(set(lang))


def extract_industry(o_P,linkedin_industries):

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
def extract_yoe(post):
    tokenize = post.split(' ')
    yoe_variation = ['years of experience','years of full time','years full time','years industry experience','years of industry experience','years work experience','years of work experience']
    for w in range(len(tokenize)):
        if tokenize[w].isdigit():
            #print(tokenize[w-5:w],tokenize[w],tokenize[w+1:w+5])
            for yv in yoe_variation:
                if yv in ' '.join(tokenize[w:w+6]):
                    #print('YOE:', tokenize[w])
                    return int(tokenize[w])
    #print('YOE:','N/A')
    return -1



def data_extraction(origPosts, jobPosts,keywords,id_list,linkedin_industries,languages):    
    output = {}
    for i in range(len(jobPosts)):  
        output[id_list[i]] = {}
        o_P = origPosts[i].split('\n')
        #SENIORITY
        output[id_list[i]]['seniorirty']=extract_seniority(o_P)
        #INDUSTRY
        output[id_list[i]]['industries']=extract_industry(o_P,linkedin_industries)
        #Keyword Extraction -----
        #Languages
        output[id_list[i]]['languages'] = extract_languages(jobPosts[i],languages)
        #TECH SKILLS
        output[id_list[i]]['skills']=extract_tech_terms(jobPosts[i], keywords)
        #Degree level
        output[id_list[i]]['degree_level']=extract_degree_lvl(jobPosts[i])
        #DEGREE TITLE
        output[id_list[i]]['degree_title']=extract_degree_title(jobPosts[i])
        #YoE
        output[id_list[i]]['yoe']=extract_yoe(jobPosts[i])
        print()
    return output
    


template = {'4385545':{'skills':['javascript,python, angular'], 
                       'industry':['healthcare','telecommunication'],
                       'education level':['bachelor','master'],
                       'seniority':'Senior',
                       'Years of Experience':5,
                       'Degree Title':['ce','cs']
                      },
            '5345465':{
                
            }
           }



orig_posts, jobPosts, id_list = preprocessing("sample_jobposts.txt")
keywords = read_termsFile("lists/final_keywords2.txt")
languages = read_termsFile("lists/topLanguages.txt")
linkedin_industries = open("lists/linkedin_industries.txt",'r').read().split('\n')
print('opened lists/linkedin_industries.txt:\nnumber of terms',len(linkedin_industries))
output = data_extraction(orig_posts, jobPosts, keywords,id_list,linkedin_industries,languages)
import pprint

pprint.pprint(output)

