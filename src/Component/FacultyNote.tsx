import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../Component/firebase";
import { collection, getDocs } from "firebase/firestore";
import { AiOutlineDownload, AiOutlineEye } from "react-icons/ai";

export const FacultyNote = () => {
  const { faculty } = useParams();
  const [facultyData, setFacultyData] = useState([]);

  useEffect(() => {
    const fetchFaculty = async () => {
      const facultyCollection = collection(db, "NoteUpload");
      const snapshot = await getDocs(facultyCollection);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const filteredData = data.filter((item) => item.faculty === faculty);
      console.log("data", data);
      console.log(filteredData, "filtereddata");
      setFacultyData(filteredData);
    };

    fetchFaculty();
  }, [faculty]);
  const navigate=useNavigate();

  return (
    <>
    <div>
      <img src="https://static.vecteezy.com/system/resources/thumbnails/008/552/477/small/abstract-banner-background-with-lines-pattern-illustration-free-vector.jpg" className="w-full  h-96"/>
    </div>
      <div className="mt-20 mx-20 flex gap-10">
        {facultyData.map((item, index) => (
          <div className=" w-72 shadow-xl h-72 rounded-sm" key={index} >
            <div className="p-2">
              <div>
                <figure>
                  <img src="https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/45c5a96e-2f3c-4e42-9bb4-4c53426965ec.png" className="h-40 w-full"/>
                </figure>
                <div className="p-2">
                <div className="flex justify-between items-center mt-4">
                  <h1 className="font-bold text-[20px]">{item.subject}</h1>
                  <h1>{item.semester}</h1>
                </div>
                <div className="flex justify-between mt-4">
                  <h1 className="flex gap-2 font-medium cursor-pointer items-center "onClick={() => navigate(`/pdf/${item.id}`)}
>
                    <AiOutlineEye color="blue" size={24} /> View Notes
                  </h1>
                  <h1 className="flex gap-2  font-medium cursor-pointer items-center">
                    <AiOutlineDownload color="blue" size={24} /> Download
                  </h1>
                </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
