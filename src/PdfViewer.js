import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Row, Col } from 'reactstrap';

// PDF viewer component
const PdfViewer = () => {
    // State for the selected PDF file and the number of pages
    const [selectedFile, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);

    // Function to format file size in a human-readable format
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    // Function to handle accepted files
    const handleAcceptedFiles = (files) => {
        const file = files[0];
        setFile({
            ...file,
            preview: URL.createObjectURL(file),
            formattedSize: formatBytes(file.size),
        });
    };

    // Set up PDF.js worker source
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    // Function called on successful loading of the PDF document
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    // Render the PDF viewer component
    return (
        <div>
            <Row>
                <Col>
                    {/* Dropzone for uploading PDF files */}
                    <Dropzone
                        onDrop={(acceptedFiles) => handleAcceptedFiles(acceptedFiles)}
                        multiple={false}
                        accept={{ 'application/pdf': ['.pdf'] }}
                        className='dropzone'
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div className='dropzone' {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className='mb-3'>
                                    <i className='display-4 text-muted ri-upload-cloud-2-line'></i>
                                </div>
                                <button type="button">Open</button>
                                <h4>Drop or click here to upload document.</h4>
                            </div>
                        )}
                    </Dropzone>

                    {/* PDF viewer and file information */}

                    {selectedFile && (
                        <Row className=' justify-content-center mt-5'>
                            <Col md={6}>
                                <div className='pdf-frame'>
                                    <Document
                                        file={selectedFile.preview}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        onLoadError={console.error}
                                    >
                                        {/* Loop through each page and render */}
                                        {Array.from(new Array(numPages), (el, pageIndex) => (
                                            <div key={`page_${pageIndex + 1}`} className='pdf-page'>
                                                <Page
                                                    pageNumber={pageIndex + 1}
                                                    scale={1.5}
                                                    renderAnnotationLayer={false}
                                                    renderTextLayer={true}
                                                />
                                                <div className='page-number'>{pageIndex + 1}</div>
                                                {pageIndex < numPages - 1 && <hr className='page-break' />}
                                            </div>
                                        ))}
                                    </Document>
                                </div>
                            </Col>
                            <Col md={3}>
                                {/* Display PDF file information */}
                                <div className='d-flex'>
                                    <p>PDF NAME:</p>
                                    <p className='' style={{ marginLeft: '20px' }}>
                                        <strong>{selectedFile?.path}</strong>
                                    </p>
                                </div>
                                <div className='d-flex'>
                                    <p>PDF SIZE:</p>
                                    <p className='' style={{ marginLeft: '20px' }}>
                                        <strong>{selectedFile?.formattedSize}</strong>
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    )}

                </Col>
            </Row>
        </div>
    );
};

export default PdfViewer;
