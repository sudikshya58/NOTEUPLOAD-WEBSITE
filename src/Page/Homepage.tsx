import { AllNote } from "../Component/AllNote"
import { Background } from "../Component/Background"
import { Banner2 } from "../Component/Banner2"
import { Header } from "../Component/Header"
import { HomeBanner } from "../Component/HomeBanner"
import { NoteDesign } from "../Component/NoteDesign"

export const Homepage = () => {
  return (
    <div>
  <Header/>
  <div>

  <div className="mx-36">
  <HomeBanner/>
  <Banner2/>
  <AllNote/>
  </div>

  </div>
  </div>
  )
}
