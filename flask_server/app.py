from flask import Flask, render_template, request
from textblob import TextBlob
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


def getContractAnalysis(selected_response):
    print(selected_response)
    
    if selected_response == "":
        return "No answer found in document"
    else:
        blob = TextBlob(selected_response)
        polarity = blob.sentiment.polarity
        print(polarity)

        if polarity > 0:
            return "Positive"
        elif polarity < 0:
            return "Negative"
        else:
            return "Neutral"



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
        answer = []
        if predictions['0'] == "":
            answer.append({
                "answer": 'No answer found in document',
                "probability": ""
            })
        else:
            # if number_results == '1':
            #     answer = f"Answer: {predictions['0']}"
            #     # st.text_area(label="Answer", value=f"{answer}")
            # else:
            
            with open("nbest.json", encoding="utf8") as jf:
                data = json.load(jf)
                for i in range(int(5)):
                    answer.append({
                        "answer": data['0'][i]['text'],
                        "probability": f"{round(data['0'][i]['probability']*100, 1)}%",
                        "analyse": getContractAnalysis(data['0'][i]['text'])
                    })
        return json.dumps(answer)

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






    





if __name__ == '__main__':
    app.run()