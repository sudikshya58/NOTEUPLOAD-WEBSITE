
import { Route, Routes } from "react-router-dom";
import { Login } from "./Page/Login";
import { Password } from "./Component/Password";
import { AddNote } from "./Page/AddNote";
import { Homepage } from "./Page/Homepage";
import PdfView from "./Page/pdfView";
import { Pdf } from "./Page/PdfViews";
import { ViewNote } from "./Page/ViewNote";
import { Dashboard } from "./Page/Dashboard";
import { AddCategory } from "./Page/AddCategory";
import { FacultyNote } from "./Component/FacultyNote";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/adminlogin" element={<Login/>}/>
        <Route path="/passwordlogin" element={<Password/>}/>
        <Route path="/addnote" element={<AddNote/>}/>
        <Route path="/addcategory" element={<AddCategory/>}/>
        <Route path="/viewnote" element={<ViewNote/>}/>
        <Route path="/pdfview/:id" element={<PdfView/>}/>
        <Route path="/pdf/:id" element={<Pdf/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/faculty/:faculty/notes/:id" element={<FacultyNote/>}/>


      </Routes>
    </>
  )
}

export default App
