
import { Route, Routes } from "react-router-dom";
import { Header } from "./Component/Header";
import { Home } from "./page/Home";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Header/>}/>

     <Route path="/home" element={<Home/>}/>
      </Routes>
    </>
  )
}

export default App
