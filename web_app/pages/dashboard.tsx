import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Layout from "../components/layout";
import AccessDenied from "../components/access-denied";
import React from 'react';
//import '../styles/demo.css';

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const [fileText, setFileText] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [response, setResponse] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setFileText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleQuestionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQuestion(event.target.value);
  };

  const handleButtonClick = () => {
    // Perform the necessary logic to generate the response based on the selected question and file text
    // Set the generated response using setResponse()
  };
  if(status === "unauthenticated") {
    return (
        <>{status}</>
    )
   }

  return (
    
    <div className="container">
      <div className="upload-section">
        <input className="file-input" type="file" onChange={handleFileUpload} />
        <textarea className="textarea" rows={10} value={fileText} readOnly />
      </div>
      <div className="controls-section">
        <select className="select-box" value={selectedQuestion} onChange={handleQuestionSelect}>
          <option value="">Select a question</option>
          <option value="Question 1">Question 1</option>
          <option value="Question 2">Question 2</option>
          <option value="Question 3">Question 3</option>
        </select>
        <button onClick={handleButtonClick}>Generate Response</button>
      </div>
      <div>
        <textarea className="response-textarea" rows={10} value={response} readOnly />
      </div>
    </div>
  
  );
};

export default Dashboard;


