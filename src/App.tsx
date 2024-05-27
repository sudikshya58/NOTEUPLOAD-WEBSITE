
import { Route, Routes } from "react-router-dom";
import { Login } from "./Page/Login";
import { Password } from "./Component/Password";
import { AddNote } from "./Page/AddNote";
import { Homepage } from "./Page/Homepage";
import PdfView from "./Page/pdfView";
import { Pdf } from "./Page/PdfViews";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/adminlogin" element={<Login/>}/>
        <Route path="/passwordlogin" element={<Password/>}/>
        <Route path="/addnote" element={<AddNote/>}/>
        <Route path="/pdfview/:id" element={<PdfView/>}/>
        <Route path="/pdf/:id" element={<Pdf/>}/>


      </Routes>
    </>
  )
}

export default App
