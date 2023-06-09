import { useEffect, useState } from 'react';
import { NavBar } from '../components/navbar';

const FileUpload: React.FC = () => {
  const [selectedResponse, setSelectedResponse] = useState<string>('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/questionsshort'); // Replace with your Flask API endpoint
      const data = await response.json();
      console.log(data);
      setQuestions(data);
    } catch (error) {
      console.log('Error fetching questions:', error);
    }
  };
  const handleQuestionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQuestion(event.target.value);
  };
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    fetch('http://127.0.0.1:5000/contracts', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        const responses = data.split('\n');
        setSelectedResponse(responses[0]);
        const htmlContent = responses
          .map((res, index) => `Answer ${index + 1}: ${res}`)
          .join('');
        document.getElementById('response')!.innerHTML = htmlContent;
        document.getElementById('explanation')!.innerHTML = '';
      })
      .catch((error) => console.log(error));
  };

  const handleExplanationClick = () => {
    if (selectedResponse !== '') {
      const encodedSelectedResponse = encodeURIComponent(selectedResponse);
      const apiUrl =
        'http://127.0.0.1:5000/contracts/paraphrase/' + encodedSelectedResponse;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const htmlContent = data
            .map((element: string) => `<p>${element}</p>`)
            .join('');
          document.getElementById('explanation')!.innerHTML = htmlContent;
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    < >
    <div className="navbar1">

    <NavBar/>
    </div>
        <div className='titre'>
            <div className='first-word'>Contract Q&A:</div> 
            <div className='complete-phrase'> 
            <span>Unlocking Answers to Vital Questions</span>
            </div>
        </div>
    <div className='dashboard'>

      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        {/* <input type="file" name="file" /> */}
        <label htmlFor="images" className="drop-container">
            <span className="drop-title">Drop files here</span>
            or
            <input type="file" className='file-upload'   name="file"  required />
            </label>
        <select name="question" className="select-box" >
          {/* <option value="What is the contract name?">
            What is the contract name?
          </option>
          <option value="Who are the parties that signed the contract?">
            Who are the parties that signed the contract?
          </option>
          <option value="What is the agreement date of the contract?">
            What is the agreement date of the contract?
          </option> */}
          {questions && questions.map((question, index) => (
                <option key={index} value={question}>
                    {question}
                </option>
                ))}
        </select>
        <input  className="custom-btn btn-8" type="submit" value="Generate Response" />
      </form>
      {/* <div id="response"></div> */}
      <div className="code-container">
                
                <section className="augs bg" data-augmented-ui>
                <input className="title" value="Get Response"/>
                    <div className="code highcontrast-dark">
                        
                            <textarea id="response" className="code-textarea" rows={10}   placeholder="Generate Response..." readOnly>

                            </textarea> 
                    </div>
                    
                    
                    
                </section>
        </div>
      <button className="custom-btn btn-9" onClick={handleExplanationClick}><span>Explain response</span></button>
      
      <div className="ccode highcontrast-dark" id="explanation"></div>
    </div>
    </>
  );
};

export default FileUpload;
