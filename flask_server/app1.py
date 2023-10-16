import streamlit as st
from predict import run_prediction
from io import StringIO
import json

st.set_page_config(layout="wide")
st.cache(show_spinner=False, persist=True)


def load_questions():
    questions = []
    with open('data/questions.txt', encoding="utf8") as f:
        questions = f.readlines()

    # questions = []
    # for i, q in enumerate(data['data'][0]['paragraphs'][0]['qas']):
    #     question = data['data'][0]['paragraphs'][0]['qas'][i]['question']
    #     questions.append(question)
    return questions


def load_questions_short():
    questions_short = []
    with open('data/questions_short.txt', encoding="utf8") as f:
        questions_short = f.readlines()

    # questions = []
    # for i, q in enumerate(data['data'][0]['paragraphs'][0]['qas']):
    #     question = data['data'][0]['paragraphs'][0]['qas'][i]['question']
    #     questions.append(question)
    return questions_short


st.cache(show_spinner=False, persist=True)


def load_contracts():
    with open('data/test.json', encoding="utf8") as json_file:
        data = json.load(json_file)

    contracts = []
    for i, q in enumerate(data['data']):
        contract = ' '.join(data['data'][i]['paragraphs'][0]['context'].split())
        contracts.append(contract)
    return contracts


questions = load_questions()
questions_short = load_questions_short()
# contracts = load_contracts()

### DEFINE SIDEBAR
st.sidebar.title("Interactive Contract Analysis")
st.sidebar.markdown(
"""
This model uses a pretrained snapshot trained on the [Atticus](https://www.atticusprojectai.org/) Dataset - CUAD

Model used for this demo: https://huggingface.co/marshmellow77/roberta-base-cuad

Related blog posts:
- https://bit.ly/3pKWICB
- https://bit.ly/3ETApRO
"""
)

st.sidebar.header("Contract Selection")

# select contract
contracts_drop = ['Contract 1', 'Contract 2', 'Contract 3']
contracts_files = ['contract-1.txt', 'contract-2.txt', 'contract-3.txt']
contract = st.sidebar.selectbox('Please Select a Contract', contracts_drop)


idx = contracts_drop.index(contract)
with open('data/'+contracts_files[idx], encoding="utf8") as f:
    contract_data = f.read()

# upload contract
user_upload = st.sidebar.file_uploader('Please upload your own', type=['txt'],
                                       accept_multiple_files=False)


# process upload
if user_upload is not None:
    print(user_upload.name, user_upload.type)
    extension = user_upload.name.split('.')[-1].lower()
    if extension == 'txt':
        print('text file uploaded')
         # To convert to a string based IO:
        stringio = StringIO(user_upload.getvalue().decode("utf-8"))

        # To read file as string:
        contract_data = stringio.read()

    # elif extension == 'pdf':
    #     import PyPDF4
    #     try:
    #         # Extracting Text from PDFs
    #         pdfReader = PyPDF4.PdfFileReader(user_upload)
    #         print(pdfReader.numPages)
    #         contract_data = ''
    #         for i in range(0, pdfReader.numPages):
    #
    #             print(i)
    #             pageobj = pdfReader.getPage(i)
    #             contract_data = contract_data + pageobj.extractText()
    #     except:
    #         st.warning('Unable to read PDF, please try another file')
    #
    # elif extension == 'docx':
    #     import docx2txt
    #
    #     contract_data = docx2txt.process(user_upload)

    else:
        st.warning('Unknown uploaded file type, please try again')

results_drop = ['1', '2', '3']
number_results = st.sidebar.selectbox('Select number of results', results_drop)

### DEFINE MAIN PAGE
st.header("Legal Contract Review Demo")
st.write("This demo uses the CUAD dataset for Contract Understanding.")

paragraph = st.text_area(label="Contract", value=contract_data, height=300)

questions_drop = questions_short
question_short = st.selectbox('Choose one of the 41 queries from the CUAD dataset:', questions_drop)
idxq = questions_drop.index(question_short)
question = questions[idxq]

if st.button('Analyze'):
    if (not len(paragraph)==0) and not (len(question)==0):
        print('getting predictions')
        with st.spinner(text='Analysis in progress...'):
            predictions = run_prediction([question], paragraph, 'marshmellow77/roberta-base-cuad',
                                         n_best_size=5)
        answer = ""
        if predictions['0'] == "":
            answer = 'No answer found in document'
        else:
            # if number_results == '1':
            #     answer = f"Answer: {predictions['0']}"
            #     # st.text_area(label="Answer", value=f"{answer}")
            # else:
            answer = ""
            with open("nbest.json", encoding="utf8") as jf:
                data = json.load(jf)
                for i in range(int(number_results)):
                    answer += f"Answer {i+1}: {data['0'][i]['text']} -- \n"
                    answer += f"Probability: {round(data['0'][i]['probability']*100,1)}%\n\n"
        st.success(answer)

    else:
        st.write("Unable to call model, please select question and contract")
