from fastapi import FastAPI
from pydantic import BaseModel

import spacy

import re
from word2number import w2n

import pdfminer.high_level
import pdfminer.layout

class body(BaseModel):
    cv:str
    jd:str

app = FastAPI()

nlp = spacy.load(r"C:\Users\abdel\Downloads\assets\ResumeModel\output\model-best")
nlp2 = spacy.load(r"C:\Users\abdel\Downloads\assets\JdModel\output\model-best")

def extract_years(string):
    try:
        pattern = r'\b(?:\d+(?:\.\d+)?|\w+)\s*(?:years?|yrs?)\b'
        matches = re.findall(pattern, string, re.IGNORECASE)
        years_list = []
        for match in matches:
            parts = match.split()
            years = w2n.word_to_num(parts[0]) if parts[0].isalpha() else float(parts[0])
            years_list.append(years)
        return years_list[0]
    except:
        return 0
    
def remove_html_tags(text):
    clean = re.compile('<.*?>')
    cleaned_text = re.sub(clean, '\n', text)
    cleaned_text = re.sub(r'\n{2,}', '\n', cleaned_text)
    cleaned_text = cleaned_text.strip()
    return cleaned_text

@app.post("/")
async def read(item:body):

    cv_txt = ''
    with open(item.cv, 'rb') as fh:
        for page_layout in pdfminer.high_level.extract_pages(fh):
            for element in page_layout:
                if isinstance(element, pdfminer.layout.LTTextBox):
                    cv_txt = cv_txt + element.get_text()
    jd_txt = remove_html_tags(item.jd)

    label_list_cv=[]
    text_list_cv = []
    dic_cv = {}


    doc = nlp(cv_txt)
    for ent in doc.ents:
        label_list_cv.append(ent.label_)
        text_list_cv.append(ent.text)

    for i in range(len(label_list_cv)):
        if label_list_cv[i] in dic_cv:
            # if the key already exists, append the new value to the list of values
            dic_cv[label_list_cv[i]].append(text_list_cv[i])
        else:
            # if the key does not exist, create a new key-value pair
            dic_cv[label_list_cv[i]] = [text_list_cv[i]]

    label_list_jd=[]
    text_list_jd = []
    dic_jd = {}
    
    doc_2 = nlp2(jd_txt)
    for ent in doc_2.ents:
        label_list_jd.append(ent.label_)
        text_list_jd.append(ent.text)
    
    for i in range(len(label_list_jd)):
        if label_list_jd[i] in dic_jd:
            # if the key already exists, append the new value to the list of values
            dic_jd[label_list_jd[i]].append(text_list_jd[i])
        else:
            # if the key does not exist, create a new key-value pair
            dic_jd[label_list_jd[i]] = [text_list_jd[i]]


    label_list_jd_2=[]
    text_list_jd_2 = []
    dic_jd_2 = {}
    
    doc_3 = nlp(jd_txt)
    for ent in doc_3.ents:
        label_list_jd_2.append(ent.label_)
        text_list_jd_2.append(ent.text)
    
    for i in range(len(label_list_jd_2)):
        if label_list_jd_2[i] in dic_jd_2:
            # if the key already exists, append the new value to the list of values
            dic_jd_2[label_list_jd_2[i]].append(text_list_jd_2[i])
        else:
            # if the key does not exist, create a new key-value pair
            dic_jd_2[label_list_jd_2[i]] = [text_list_jd_2[i]]


    ########   compare job title and resume work AS
    try:
        jd_post = dic_jd['JOBPOST'][0]
        resume_workAS = dic_cv['WORKED AS'][0]
        # jd_post = 'dj'
        # resume_workAS = 'djs dd'
        jdpost_similarity = 0
        if resume_workAS in jd_post or jd_post in resume_workAS:
            jdpost_similarity = 1
        else:
            jdpost_similarity = 0
    except:
        jdpost_similarity = 0

        
    ########   compare resume_experience and jd_experience
    try:
        jd_experience = extract_years(dic_jd['EXPERIENCE'][0])
        resume_experience = extract_years(dic_cv['YEARS OF EXPERIENCE'][0])
        # jd_experience = 3
        # resume_experience = 3
        experience_similarity = 0
        if resume_experience:
            experience_difference = (jd_experience - resume_experience)
            if (experience_difference <= 0):
                print("Experience Matched")
                experience_similarity = 1
            elif (0 < experience_difference <= 1):
                print("Experience  can be considered")
                experience_similarity = 0.7
            else:
                print("Experience  Unmatched")
                experience_similarity = 0 
   
    except:
        experience_similarity = 0

        
    
    ########   compare skills
    try:
        job_description_skills = dic_jd['SKILLS']
        resume_skills = dic_cv['SKILLS']
        # job_description_skills = ['python','angular','sql']
        # resume_skills = ['python','angular','Sql']

        job_description_skills = [item.lower() for item in job_description_skills]
        resume_skills = [item.lower() for item in resume_skills]
        count = 0
        for skill in job_description_skills:
            for resume_skill in resume_skills:
                if skill in resume_skill:
                    count += 1
                    break

        skills_similarity = count/len(job_description_skills)

            
        
    except:
        skills_similarity = 0
    
    #######  campare Degree
    try:
        job_description_deg = dic_jd['DEGREE']
        resume_deg = dic_cv['DEGREE']
        # job_description_deg = ['python','angular','sql']
        # resume_deg = ['python']

        job_description_deg = [item.lower() for item in job_description_deg]
        resume_deg = [item.lower() for item in resume_deg]
        count = 0
        if job_description_deg:
            for degre in job_description_deg:
                for resume_degre in resume_deg:
                    if degre in resume_degre or resume_degre in degre:
                        count += 1
                        break

            degree_similarity =1 - ((len(job_description_deg) - count)/ len(job_description_deg))
            
        else:
            degree_similarity = 0
            
        
    except:
        degree_similarity = 0

    #######  campare lang
    try:
        job_description_lan = dic_jd_2['LANGUAGE']
        resume_lan = dic_cv['LANGUAGE']
        # job_description_lan = ['python','angular']
        # resume_lan = ['python']

        job_description_lan = [item.lower() for item in job_description_lan]
        resume_lan = [item.lower() for item in resume_lan]
        count = 0
        if job_description_lan:
            for jd_ln in job_description_lan:
                for cv_ln in resume_lan:
                    if jd_ln in cv_ln or cv_ln in jd_ln:
                        count += 1
                        break

            lang_similarity =1 - ((len(job_description_lan) - count)/ len(job_description_lan))
            
        else:
            lang_similarity = 0
            
        
    except:
        lang_similarity = 0


    # jd_experience = extract_years(dic_jd['EXPERIENCE'][0])
    # resume_experience = extract_years(dic_cv['YEARS OF EXPERIENCE'][0])
    # job_description_skills = dic_jd['SKILLS']
    # resume_skills = dic_cv['SKILLS']
    # jd_post = dic_jd['JOBPOST'][0]
    # resume_workAS = dic_cv['WORKED AS'][0]
    # , "jdff":jd_experience+" "+resume_experience+" "+job_description_skills+" "+resume_skills+" "+jd_post+" "+resume_workAS


    jdpost_similarity = jdpost_similarity * 0.2
    experience_similarity = experience_similarity * 0.2
    skills_similarity = skills_similarity * 0.4
    degree_similarity = degree_similarity * 0.1
    lang_similarity = lang_similarity * 0.1

    matching=(jdpost_similarity+experience_similarity+skills_similarity+lang_similarity+degree_similarity)*100
    matching = round(matching,2)
    print(matching)
    return { "score":matching}



@app.post("/score")
async def score(item:body):
    # cv_txt = ''
    # with open(item.cv, 'rb') as fh:
    #     for page_layout in pdfminer.high_level.extract_pages(fh):
    #         for element in page_layout:
    #             if isinstance(element, pdfminer.layout.LTTextBox):
    #                 cv_txt = cv_txt + element.get_text()
    return {"score":item}



# , "SKills Matched:":lang_similarity, "job_similarity":degree_similarity, "Experiece Similarity":experience_similarity, 'cv':dic_cv, 'jd':dic_jd_2

#     jd_txt = '''Position Description 
# Position Title: Python Developer 
# Tasks and responsibilities 
# The candidate will participate in the various stages of software development for complex web applications 
# The candidate will participate in the development of the solution (design, ideation, technological choices ...) 
# The candidate will work in an Agile environment. 
# The candidate will be responsible for the stability and performance of the application 
# Qualifications/Skills Required: 
# Practical experience in web backend development for at least 1 years 
# Expertise in several of the technologies listed below: 
# Django 
# Python 
# Bootstrap 
# HTML 
# Jquery 
# CSS 
# Ajax 
# Javascript 
# Bootstrap 
# GIT lab 
# Preferred Competencies: 
# Diploma in Computer Science (College or University) 
# Asset: 
# Docker 
# Kubernetes / OpenShift 
# Vue.js, Angular or React 
# HTML5, CSS3, GIT, Webpack, NPM 
# Your future duties and responsibilities 
# Required Qualifications To Be Successful In This Role 
# Insights you can act on 
# While technology is at the heart of our clients’ digital transformation, we understand that people are at the heart of b
# usiness success. 
# language : anglais , french, francais
# When you join CGI, you become a trusted advisor, collaborating with colleagues and clients to bring forward action
# able insights that deliver meaningful and sustainable outcomes. We call our employees "members" because they are 
# CGI shareholders and owners and owners who enjoy working and growing together to build a company we are prou
# d of. This has been our Dream since 1976, and it has brought us to where we are today — one of the world’s largest i
# ndependent providers of IT and business consulting services. 
# At CGI, we recognize the richness that diversity brings. We strive to create a work culture where all belong and colla
# borate with clients in building more inclusive communities. As an equal-opportunity employer, we want to empower
# all our members to succeed and grow. If you require an accommodation at any point during the recruitment process,
# please let us know. We will be happy to assist. 
# Ready to become part of our success story? Join CGI — where your ideas and actions make a difference.'''