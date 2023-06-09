import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Layout from "../components/layout";
import AccessDenied from "../components/access-denied";
import React from 'react';
import { NavBar } from "../components/navbar";
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
    <>
   {/*  <div className="nav navbar">

    <NavBar ></NavBar>
    </div>  */}
    <div className="container">
       <div className="upload-section">
            <label htmlFor="images" className="drop-container">
            <span className="drop-title">Drop files here</span>
            or
            <input type="file" id="images"  required  onChange={handleFileUpload} />
            </label>
            <div className="controls-section">
            
                <select className="select-box" value={selectedQuestion} onChange={handleQuestionSelect}>
                <option value="">Select a question</option>
                <option value="Question 1">Question 1</option>
                <option value="Question 2">Question 2</option>
                <option value="Question 3">Question 3</option>
                </select>
                <button onClick={handleButtonClick} className="custom-btn btn-8"><span>Generate Response</span></button>
        
       
            </div>
            
            <div className="code-container">
                <div className="glow-container">
                    <div className="augs" data-augmented-ui></div>
                </div>
                <section className="augs bg" data-augmented-ui>
                    
                    <input className="title" value="Get Response"/>
                    <div className="code highcontrast-dark">
                    <textarea className="code-textarea" rows={10}  value={fileText} placeholder="Generate Response...">

                    </textarea>
                    </div>
                </section>
            </div>

        </div>
      
      <div>
      </div>
    </div>
    </>
  
  );
};

export default Dashboard;


