import json

with open('./cuad-data/CUADv1.json') as json_file:
    data = json.load(json_file)
    
with open('./questions.txt', 'w') as questions_file:
    for i, q in enumerate(data['data'][0]['paragraphs'][0]['qas']):
        question = data['data'][0]['paragraphs'][0]['qas'][i]['question']
        questions_file.write(f"Question {i+1}: {question}\n")
    
