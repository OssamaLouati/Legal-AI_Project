from flask import Flask, render_template, request
from paraphrase import paraphrase
from predict import run_prediction
from io import StringIO
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
answers = []




def load_questions_short():
    questions_short = []
    with open('data/questions_short.txt', encoding="utf8") as f:
        questions_short = f.readlines()


    return questions_short





questions_short = load_questions_short()



@app.route('/questionsshort')
def getQuestionsShort():
    return questions_short




@app.route('/contracts/', methods=["POST"])
def getContractResponse():
    
    file = request.files["file"]
    question = request.form['question']

    # Process the text file
    stringio = StringIO(file.getvalue().decode("utf-8"))
    response = []
    answer = ""
    # To read file as string:
    paragraph = stringio.read()

    if (not len(paragraph)==0) and not (len(question)==0):
        print('getting predictions')
        
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
                for i in range(int(5)):
                    answer += f" {data['0'][i]['text']}  "
                    answer += f"Probability: {round(data['0'][i]['probability']*100,1)}%\n\n"
        return answer

    else:
        return "Unable to call model, please select question and contract"

 




@app.route('/contracts/paraphrase/<path:selected_response>', methods=['GET'])
def getContractParaphrase(selected_response):
    print(selected_response)
    
    if selected_response == "":
        return "No answer found in document"
    else:
        print('getting paraphrases')
        paraphrases = paraphrase(selected_response)
        print(paraphrases)
        return paraphrases

@app.route('/get_response', methods=['POST'])
def get_response():
    question = request.form['selected_response']
    with open('responses.json', 'r') as file:
        responses = json.load('responses.json')
        for response in responses:
            if response['question'] == question:
                return response['answer']
    
    return "Response not found"



""" @app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    file_content = file.read().decode('utf-8')
    return file_content """

@app.route('/proces', methods=['POST'])
def process():
    print("Inside the process route")
    file = request.files["file"]
    
    
    # Process the text file
    stringio = StringIO(file.getvalue().decode("utf-8"))

    # To read file as string:
    paragraph = stringio.read()
    
   
    questions = questions_short
  
    
    # Perform your question processing and generate the responses
    responses = []
    if (not len(paragraph)==0):
        print('getting predictions')
        
        for question in questions:
            predictions = run_prediction([question], paragraph, 'marshmellow77/roberta-base-cuad', n_best_size=1)
            answer = ""
            if predictions['0'] == "":
                answer = 'No answer found in document'
            else:
                with open("nbest.json", encoding="utf8") as jf:
                    data = json.load(jf)
                    for i in range(int(1)):
                        """  answer += f"Question: {question}\n" """
                        answer += f" {data['0'][i]['text']}\n"
                        answer += f"Probability: {round(data['0'][i]['probability']*100, 1)}%\n\n"
            responses.append({"question": question, "answer": answer})

        # Save the responses to a JSON file
        with open('responses.json', 'w') as file:
            json.dump(responses, file)
       
        return "saved responses"
    else:
        print('no text')
        return "something went wrong"

    





if __name__ == '__main__':
    app.run()