import { NavLink, useLocation } from "react-router-dom";
import { Navitem } from "../Page/index.ts";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

interface FacultyItem {
  id: string;
  faculty: string;
  // Add other fields if needed
}

export const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [faculty, setFaculty] = useState<FacultyItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const facultyCollection = collection(db, "Faculty");
        const snapshot = await getDocs(facultyCollection);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as FacultyItem[];
        setFaculty(data);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };

    fetchFaculty();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <nav className="p-1">
        <ul className="flex justify-between items-center mx-32">
          <h1 className="h-16 flex items-center text-[#3f5efb] font-bold w-40">
            Note Bridge
          </h1>

          <li className="flex gap-20 cursor-pointer font-bold">
            {Navitem.map((item, index: number) => (
              <div
                key={index}
                className="relative text-[16px]"
                onMouseEnter={() => item.name === "Courses" && setShowDropdown(true)}
                onMouseLeave={() => item.name === "Courses" && setShowDropdown(false)}
              >
                <NavLink
                  to={item.path}
                  className={`px-4 py-2 text-[16px] text-gray-500 ${
                    location.pathname === item.path ? "bg-[#19467e] rounded text-white" : ""
                  }`}
                >
                  {item.name}
                </NavLink>
                {item.name === "Courses" && showDropdown && (
                  <ul className="absolute left-0 top-full mt-2 w-40 bg-gray-100 border border-gray-200 shadow-lg">
                    {faculty.map((facultyItem) => (
                      <li
                        key={facultyItem.id}
                        className="px-4 py-2 text-black hover:bg-blue-100"
                      >
                        <NavLink
                          to={`/faculty/${facultyItem.faculty}/notes/${facultyItem.id}`}
                        >
                          {facultyItem.faculty}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </li>
        </ul>
      </nav>
    </div>
  );
};
