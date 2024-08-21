import { AllNote } from "../Component/AllNote"
import { Background } from "../Component/Background"
import { Banner2 } from "../Component/Banner2"
import { Footer } from "../Component/Footer"
import { Header } from "../Component/Header"
import { HomeBanner } from "../Component/HomeBanner"
import { NoteDesign } from "../Component/NoteDesign"

export const Homepage = () => {
  return (
    <div>
  <Header/>
  <div>

  <div className="mx-6 lg:mx-20 sm:mx-10">
  <Banner2/>
  <AllNote/>
  </div>
  <Footer/>

  </div>
  </div>
  )
}
