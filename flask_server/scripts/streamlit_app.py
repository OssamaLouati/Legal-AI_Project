from transformers import AutoModelForQuestionAnswering, AutoTokenizer
import torch
import streamlit as st
from transformers.pipelines import pipeline
import json
from predict import run_prediction


st.set_page_config(layout="wide")


st.cache(show_spinner=False, persist=True)
def load_model():
    model = AutoModelForQuestionAnswering.from_pretrained('../cuad-models/roberta-base/')
    tokenizer = AutoTokenizer.from_pretrained('../cuad-models/roberta-base/', use_fast=False)
    return model, tokenizer

st.cache(show_spinner=False, persist=True)
def load_questions():
	with open('../cuad-data/test.json') as json_file:
		data = json.load(json_file)

	questions = []
	for i, q in enumerate(data['data'][0]['paragraphs'][0]['qas']):
		question = data['data'][0]['paragraphs'][0]['qas'][i]['question']
		questions.append(question)
	return questions

st.cache(show_spinner=False, persist=True)
def load_contracts():
	with open('../cuad-data/test.json') as json_file:
		data = json.load(json_file)

	contracts = []
	for i, q in enumerate(data['data']):
		contract = ' '.join(data['data'][i]['paragraphs'][0]['context'].split())
		contracts.append(contract)
	return contracts

model, tokenizer = load_model()
questions = load_questions()
contracts = load_contracts()

st.header("Contract Understanding Atticus Dataset (CUAD) Demo")
st.write("This demo uses a machine learning model for Contract Understanding.")

add_text_sidebar = st.sidebar.title("Menu")
add_text_sidebar = st.sidebar.text("Hello, world!")

# cols = st.beta_columns(2)

# question = st.text_input(label='Insert a query.')
question = st.selectbox('Choose one of the 41 queries from the CUAD dataset:', questions)
paragraph = st.text_area(label="Contract")
# st.write(contracts[1])


if (not len(paragraph)==0) and not (len(question)==0):
	# encoding = tokenizer.encode_plus(text=question, text_pair=paragraph)
	# inputs = encoding['input_ids']
	# tokens = tokenizer.convert_ids_to_tokens(inputs)
	# outputs = model(input_ids=torch.tensor([inputs]))

	# start_scores = outputs.start_logits
	# end_scores = outputs.end_logits
	# start_index = torch.argmax(start_scores)
	# end_index = torch.argmax(end_scores)
	# answer = tokenizer.convert_tokens_to_string(tokens[start_index:end_index+1])
	prediction = run_prediction(question, paragraph, '../cuad-models/roberta-base/')
	st.write("Answer: " + prediction.strip())
	

my_expander = st.beta_expander("Sample Contract", expanded=False)
my_expander.write(contracts[1])