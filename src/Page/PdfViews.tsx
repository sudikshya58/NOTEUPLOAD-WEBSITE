import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Component/firebase';
import { pdfjs, Document, Page } from 'react-pdf';
import Loader from './Loader';

// Setting worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const Pdf = () => {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageHeight, setPageHeight] = useState(0);

  useEffect(() => {
    const fetchPdfUrl = async () => {   
setLoading(true);
      try {
        const docRef = doc(db, 'NoteUpload', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const pdfData = docSnap.data();
          // Assuming the PDF URL is stored in the 'Files' field of the document
          if (pdfData && pdfData.Files) {
            setPdfUrl(pdfData.Files);
          } else {
            throw new Error('PDF URL not found in document');
          }
        } else {
          throw new Error('Document does not exist');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPdfUrl();
  }, [id]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false); // Hide loader when PDF is loaded
  };

  const handleContentHeight = (height) => {
    setPageHeight(Math.max(pageHeight, height));
  };

  if (loading) {
    return <Loader/>;// Show loader while loading
  }

  if (error) {
    return <p>Error loading PDF: {error}</p>;
  }

  return (
    <div className="mt-10">
      {pdfUrl ? (
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {Array.from(new Array(numPages), (el, index) => (
              <div
                key={`page_${index + 1}`}
                style={{ height: pageHeight, marginBottom: '0.5rem' }}
              >
                <p>Page {index + 1}</p>
                <Page
                  pageNumber={index + 1}
                  width={Math.min(1800, window.innerWidth * 0.9)}
                  renderTextLayer={false}
                  onLoadSuccess={({ height }) => handleContentHeight(height)}
                />
              </div>
            ))}
          </div>
        </Document>
      ) : (
        <p>No PDF URL found</p>
      )}
    </div>
  );
};
