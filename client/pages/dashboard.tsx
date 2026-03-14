import { useEffect, useState } from 'react';
import AccessDenied from '../components/access-denied';
import { useSession } from 'next-auth/react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:5001';

const FileUpload: React.FC = () => {
  const [selectedResponse, setSelectedResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const { data: session, status } = useSession();
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      // Legacy endpoint removed in server_v2. Keep UI functional with a minimal default.
      const defaults = [
        "What is the contract name?",
        "Who are the parties that signed the contract?",
        "What is the agreement date of the contract?",
      ];
      setQuestions(defaults as any);
      // Ensure the select has a default value
      if (!selectedQuestion) {
        setSelectedQuestion(defaults[0]);
      }
    } catch (error) {
      console.log('Error fetching questions:', error);
    }
  };
  const handleQuestionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQuestion(event.target.value);
  };
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setSelectedResponse('');

    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File | null;
    console.log('[dashboard] submitting', {
      backend: BACKEND_URL,
      question: formData.get('question'),
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
    });
    // Ensure a question is always sent (backend requires it)
    if (!formData.get('question')) {
      const fallbackQuestion = questions?.[0] ?? 'What is the agreement date of the contract?';
      formData.set('question', fallbackQuestion as any);
    }
  
    fetch(`${BACKEND_URL}/v2/contracts/answer`, {
      method: 'POST',
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || `Request failed with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('[dashboard] backend response', data);
        const answerText = typeof data?.answer === 'string' ? data.answer : JSON.stringify(data, null, 2);
        setSelectedResponse(answerText);

        const textarea = document.getElementById('response') as HTMLTextAreaElement;
        textarea.value = answerText ? `Answer: ${answerText}` : 'No answer returned.';
  
        // Update answer colors based on analysis
        // Analysis coloring removed in server_v2 response.
  
  
        document.getElementById('explanation')!.innerHTML = '';
      })
      .catch((error) => {
        console.log(error);
        setError(error?.message ?? 'Something went wrong');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  
  

  const handleExplanationClick = () => {
    // Paraphrase endpoint not yet implemented in server_v2.
  };
  if(status === "unauthenticated") {
    return (
        <>{status}
        <AccessDenied /></>
    )
}
  return (
    < >
    
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
        <select
          name="question"
          className="select-box"
          value={selectedQuestion}
          onChange={handleQuestionSelect}
        >
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
        <input
          className="custom-btn btn-8"
          type="submit"
          value={isLoading ? "Analyzing…" : "Generate Response"}
          disabled={isLoading}
        />
      </form>

      {isLoading && (
        <div style={{ marginTop: 12, color: '#fff' }}>
          Server is thinking… Digesting the document and generating an answer.
        </div>
      )}

      {error && (
        <div style={{ marginTop: 12, color: '#ff6b6b', whiteSpace: 'pre-wrap' }}>
          {error}
        </div>
      )}
      {/* <div id="response"></div> */}
      <div className="code-container">
                
                <section className="augs bg" data-augmented-ui>
                <input className="title" defaultValue="Get Response" readOnly />
                    <div className="code highcontrast-dark">
                        
                            <textarea id="response" className="code-textarea" rows={10}   placeholder="Generate Response..." readOnly>

                            </textarea> 
                    </div>
                    
                    
                    
                </section>
        </div>
      <button className="custom-btn btn-9" onClick={handleExplanationClick}><span>Explain response</span></button>
      
      <div className="ccode highcontrast-dark" id="explanation"></div>
      <div className="ccode highcontrast-dark" id="analysis"></div>
    </div>
    </>
  );
};

export default FileUpload;
