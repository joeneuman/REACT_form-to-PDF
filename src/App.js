import './App.css';


import React, { useState, useRef } from 'react';
import * as PDFLib from 'pdf-lib'; // Assuming PDFLib is installed as an npm package

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const pdfFileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pdfFile = pdfFileRef.current.files[0];

    if (!pdfFile) {
        alert('Please select a PDF file.');
        return;
    }

    const fileBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(fileBuffer);
    
    // Get the form fields from the PDF
    const form = pdfDoc.getForm();
    const nameField = form.getTextField('Name');
    const emailField = form.getTextField('Email');

    // Set the values for the form fields
    nameField.setText(name);
    emailField.setText(email);

    // Serialize the PDF to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Trigger a download for the user
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'filled_form.pdf';
    link.click();
  }

  return (
    <form id="pdfForm" onSubmit={handleSubmit}>
        <label htmlFor="pdfFile">Select a PDF:</label>
        <input type="file" ref={pdfFileRef} name="pdfFile" id="pdfFile" accept=".pdf" required />

        <label htmlFor="name">Name:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} id="name" required />
        
        <label htmlFor="email">Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} id="email" required />
        
        <input type="submit" value="Generate PDF" />
    </form>
  );
}

export default App;
