import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Component/firebase';
import Loader from './Loader';

interface PdfData {
  Files: string;
}

export const Pdf: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        if (!id) throw new Error('ID is missing');
        const docRef = doc(db, 'NoteUpload', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const pdfData = docSnap.data() as PdfData;
          if (pdfData?.Files) setPdfUrl(pdfData.Files);
          else throw new Error('PDF URL not found');
        } else {
          throw new Error('Document does not exist');
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPdfUrl();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="mt-10">
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          width="100%"
          height="900px"
          style={{ border: 'none' }}
          allow="autoplay"
          title="PDF Viewer"
        />
      ) : (
        <p>No PDF found</p>
      )}
    </div>
  );
};