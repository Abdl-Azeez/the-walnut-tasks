// App.js
import React from 'react';
import "./App.css"
import PdfViewer from './PdfViewer';

function App() {
  return (
    <div className='text-center py-5'>
      <h1>PDF Viewer</h1>
      <PdfViewer />
    </div>
  );
}

export default App;
