import { NavLink } from "react-router-dom";
import { Navitem } from "../Page/index.ts";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

interface FacultyItem {
  id: string;
  faculty: string;
}

export const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [faculty, setFaculty] = useState<FacultyItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const facultyCollection = collection(db, "Faculty");
        const snapshot = await getDocs(facultyCollection);
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data() as Omit<FacultyItem, "id">;
          return {
            id: doc.id,
            ...docData,
          };
        });
        setFaculty(data);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };

    fetchFaculty();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="text-[#3f5efb] font-bold text-xl md:text-2xl">
          Note Bridge
        </NavLink>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 font-bold text-gray-700 items-center">
          {Navitem.map((item, index) => (
            <li
              key={index}
              className="relative"
              onMouseEnter={() => item.name === "Courses" && setShowDropdown(true)}
              onMouseLeave={() => item.name === "Courses" && setShowDropdown(false)}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded ${
                    isActive ? "bg-[#19467e] text-white" : "hover:bg-gray-200"
                  }`
                }
              >
                {item.name}
              </NavLink>

              {/* Dropdown for Courses */}
              {item.name === "Courses" && showDropdown && (
                <ul className="absolute left-0 top-full mt-2 w-40 bg-gray-100 border border-gray-300 rounded shadow-lg z-50">
                  {faculty.map((facultyItem) => (
                    <li key={facultyItem.id}>
                      <NavLink
                        to={`/faculty/${facultyItem.faculty}/notes/${facultyItem.id}`}
                        className="block px-4 py-2 hover:bg-blue-100 text-black"
                      >
                        {facultyItem.faculty}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {/* Hamburger Icon */}
          <svg
            className="h-6 w-6 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <ul className="flex flex-col font-bold text-gray-700">
            {Navitem.map((item, index) => (
              <li key={index} className="border-b border-gray-200">
                {item.name === "Courses" ? (
                  <MobileCoursesDropdown faculty={faculty} closeMenu={() => setMobileMenuOpen(false)} />
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block px-4 py-3 ${
                        isActive ? "bg-[#19467e] text-white" : "hover:bg-gray-100"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

// Mobile Courses Dropdown
interface MobileCoursesDropdownProps {
  faculty: FacultyItem[];
  closeMenu: () => void;
}

const MobileCoursesDropdown: React.FC<MobileCoursesDropdownProps> = ({
  faculty,
  closeMenu,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-100 font-bold"
      >
        Courses
        <svg
          className={`h-5 w-5 transform transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="bg-gray-50 border-t border-b border-gray-200">
          {faculty.map((facultyItem) => (
            <li key={facultyItem.id}>
              <NavLink
                to={`/faculty/${facultyItem.faculty}/notes/${facultyItem.id}`}
                className="block px-6 py-3 hover:bg-blue-100 text-black"
                onClick={closeMenu}
              >
                {facultyItem.faculty}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
