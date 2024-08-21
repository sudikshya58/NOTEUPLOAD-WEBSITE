import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "./firebase";
import banner from "../banner.jpg";
import { collection, getDocs } from "firebase/firestore";
import { AiOutlineDownload, AiOutlineEye } from "react-icons/ai";
import { Footer } from "./Footer";
import { Header } from "../Component/Header";

// Define a type for the faculty data
interface FacultyNoteData {
  id: string;
  faculty: string;
  subject: string;
  semester: string;
  // Add other fields if needed
}

export const FacultyNote = () => {
  const { faculty } = useParams<{ faculty: string }>(); // Ensure correct typing for params
  const [facultyData, setFacultyData] = useState<FacultyNoteData[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const facultyCollection = collection(db, "NoteUpload");
        const snapshot = await getDocs(facultyCollection);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FacultyNoteData[];
        const filteredData = data.filter(item => item.faculty === faculty);

        console.log("Fetched data:", data);
        console.log("Filtered data:", filteredData);

        setFacultyData(filteredData);
      } catch (error) {
        setError("Failed to fetch data");
        console.error("Error fetching faculty data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [faculty]);

  return (
    <>
      <Header />
      <div>
        <img src={banner} alt="Banner" className="w-full object-cover h-96" />
      </div>
      <div className="mt-20 mx-20 h-full flex gap-10 flex-wrap">
        {loading ? (
          <div className="h-[30vh] flex items-center justify-center text-[20px] font-bold w-full">
            Loading...
          </div>
        ) : error ? (
          <div className="h-[30vh] flex items-center justify-center text-[20px] font-bold w-full">
            {error}
          </div>
        ) : facultyData.length > 0 ? (
          facultyData.map((item) => (
            <div className="w-72 shadow-xl h-72 rounded-sm" key={item.id}>
              <div className="p-2">
                <figure>
                  <img
                    src="https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/45c5a96e-2f3c-4e42-9bb4-4c53426965ec.png"
                    alt="Subject"
                    className="h-40 w-full object-cover"
                  />
                </figure>
                <div className="p-2">
                  <div className="flex justify-between items-center mt-4">
                    <h1 className="font-bold text-[20px]">{item.subject}</h1>
                    <h1>{item.semester}</h1>
                  </div>
                  <div className="flex justify-between mt-4">
                    <h1
                      className="flex gap-2 font-medium cursor-pointer items-center"
                      onClick={() => navigate(`/pdf/${item.id}`)}
                    >
                      <AiOutlineEye color="blue" size={24} /> View Notes
                    </h1>
                    <h1 className="flex gap-2 font-medium cursor-pointer items-center">
                      <AiOutlineDownload color="blue" size={24} /> Download
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-[30vh] flex items-center justify-center text-[20px] font-bold w-full">
            No data available
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};
