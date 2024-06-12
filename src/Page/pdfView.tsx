import React, { useEffect, useState } from "react";
import { db } from "../Component/firebase";
import {  doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { Document, Page } from 'react-pdf';

const PdfView = () => {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      const docRef = doc(db, "NoteUpload", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const pdfData = docSnap.data();
        // Assuming the PDF URL is stored in the 'Files' field of the document
        if (pdfData && pdfData.Files) {
          setPdfUrl(pdfData.Files);
        }
      }
    };

    fetchPdfUrl();
  }, [id]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className=" bg-red-300">
      {pdfUrl && (
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      )}
    </div>
  );
};

export default PdfView;
