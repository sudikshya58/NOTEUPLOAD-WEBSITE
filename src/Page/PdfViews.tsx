import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Component/firebase';
import { pdfjs, Document, Page } from 'react-pdf';
import Modal from '../Component/Modal';

// Setting worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const Pdf = () => {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
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
  };

  if (loading) {
    return <p>Loading PDF...</p>;
  }

  if (error) {
    return <p>Error loading PDF: {error}</p>;
  }

  return (
    <div className="mt-10">
      {pdfUrl ? (
        <div>
          <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
            <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={Math.min(1800, window.innerWidth * 0.9)}
                  renderTextLayer={false}
                  scale={1}
                />
              ))}
            </Document>
          </Modal>
        </div>
      ) : (
        <p>No PDF URL found</p>
      )}
    </div>
  );
};
