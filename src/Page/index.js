// data.js or similar file
import time from "../../public/time.png";
import place from "../../public/place.png";

export const Logins = [
  {
    name: "Username",
    placeholder: " name",
    formname: "username",
    type: "string",
  },
  {
    name: "Email",
    placeholder: "email",
    formname: "useremail",
    type: "email",
  },
  // {
  //     name:"Password",
  //     placeholder:"Enter your email",
  //     formname:"userpassword",
  //     type:"password"
  // }
];

export const Notes = [
  {
    name: "Semester or Year",
    placeholder: "semester or year",
    formname: "semester",
    type: "string",
  },
  {name:"Subject",
    placeholder:"subject",
    formname:"subject",
    type:"string"
  }
];

export const Navitem=[
  {
    name:"Home",
    path:"/",
  },
  {
    name:"About Us",
    path:"/about",
  },
  {
    name:"Contact",
    path:"/contact",
  },
  {
    name:"Courses",
    path:"/course",
  },
  {
    name:"Login",
    path:"/login",
  },
];

export const FacultyName=[
  {
    Name : 'CSIT',
    path:"/",
  },
  {
    Name : 'CSIT',
    path:"/",
  },
  {
    Name : 'CSIT',
    path:"/",
  },
  {
    Name : 'CSIT',
    path:"/",
  },
  {
    Name : 'CSIT',
    path:"/",
  },
];

export const DashboardLinks= [
  {
    label: "Add Note",
    path: "/add-note",
    icon: null,
  },
  {
    label: "View Note",
    path: "/add-note",
    icon: null,
  },
];

export const Banner = [
  {
    icon:time,
    title: "Unlock Your Potential",
    description: "Master new skills and advance your career with our expert-led courses. Start learning today!.Join our community of learners and take the first step towards achieving your professional goals.",
  },
  {
    icon:place,
    title: "Learn Anywhere, Anytime",
    description: "Access our courses on any device,anytime. .Our platform ensures that you can continue your education without any interruptions, making it convenient to balance learning with your busy lifestyle.",
  },
  {
    icon:time,
    title: "Expert-Led Education",
    description: "Learn from industry experts. Gain practical knowledge you can apply immediately. Join now!. Gain practical knowledge  and skills that you can apply immediately in your job or personal projects.",
  },
];
