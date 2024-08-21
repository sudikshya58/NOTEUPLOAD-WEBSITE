import { NavLink, useLocation } from "react-router-dom";
import { Navitem } from "../Page/index.js";
import { db } from "../Component/firebase";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import NoteNepal from "../../public/Notes.png";

interface HeaderProps {
  path: string;
  name: string;
}

export const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [faculty, setFaculty] = useState([]);
  const location = useLocation();

  // Fetch faculty data from Firestore on component mount
  useEffect(() => {
    const fetchFaculty = async () => {
      const facultyCollection = collection(db, "Faculty");
      const snapshot = await getDocs(facultyCollection);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFaculty(data);
    };

    fetchFaculty();
  }, []);

  // Improved logging for debugging purposes
  console.log("Fetched faculty data:", faculty);

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <nav className=" p-1 ">
        <ul className="flex justify-between items-center mx-32">
          {/* Corrected the image rendering */}
          <h1 className="h-16 flex justify-between items-center text-[#3f5efb] font-bold w-40 object-cover">Note Bridge</h1>
         

          <li className="flex gap-20 cursor-pointer   font-bold">
            {Navitem.map((item: HeaderProps, index: number) => (
              <div key={index} className="relative text-[16px]">
                {item.name === "Courses" ? (
                  <div
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    <NavLink
                      to={item.path}
                      className={`px-4 py-2  text-[16px] text-gray-500  ${
                        location.pathname === item.path && " bg-[#19467e] rounded text-white"
                      }`}
                    >
                      {item.name}
                    </NavLink>
                    {showDropdown && faculty.length > 0 && ( // Check for fetched data
                      <ul className="absolute left-0 top-full mt-2 w-40 bg-gray-100 border border-gray-200 shadow-lg">
                        {/* Dynamically render faculty names as dropdown items */}
                        {faculty.map((facultyItem) => (
                          <li key={facultyItem.id} className="px-4 py-2 text-black hover:bg-blue-100">
                            <NavLink to={`/faculty/${facultyItem.faculty}/notes/${facultyItem.id}`}>
                              {facultyItem.faculty}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.path}
                    className={`px-4 py-2 text-[16px] text-gray-500  ${
                      location.pathname === item.path && "bg-blue-600 rounded text-white"
                    }`}
                  >
                    {item.name}
                  </NavLink>
                )}
              </div>
            ))}
          </li>
        </ul>
      </nav>
    </div>
  );
};
