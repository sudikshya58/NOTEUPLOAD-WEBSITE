import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Component/firebase"; // Correct path without `.ts`
import { Document, Page, pdfjs } from 'react-pdf';

// Set worker path for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Type definitions
interface PdfData {
  Files: string;
}

interface OnDocumentLoadSuccessProps {
  numPages: number;
}

const PdfView: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // Make id optional
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      if (!id) {
        setError('No PDF ID provided');
        return;
      }
      
      try {
        const docRef = doc(db, "NoteUpload", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const pdfData = docSnap.data() as PdfData;
          if (pdfData && pdfData.Files) {
            setPdfUrl(pdfData.Files);
          } else {
            setError('PDF URL not found in document');
          }
        } else {
          setError('Document does not exist');
        }
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchPdfUrl();
  }, [id]);

  const onDocumentLoadSuccess = ({ numPages }: OnDocumentLoadSuccessProps) => {
    setNumPages(numPages);
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="bg-red-300">
      {pdfUrl ? (
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {numPages && Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={Math.min(1800, window.innerWidth * 0.9)}
            />
          ))}
        </Document>
      ) : (
        <h1>No PDF URL found</h1>
      )}
    </div>
  );
};

export default PdfView;
