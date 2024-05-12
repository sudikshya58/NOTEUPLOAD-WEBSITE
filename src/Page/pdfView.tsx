import { useEffect, useState } from "react";
import { db } from "../Component/firebase";
import {  doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { PdfComponent } from "../Component/PDdfComponent";

const PdfView = () => {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  console.log(pdfUrl)

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

  return (
    <div className="mt-10">
   {pdfUrl &&   <PdfComponent src={pdfUrl} />}
   PDFViewer
    </div>
  );
};

export default PdfView;
