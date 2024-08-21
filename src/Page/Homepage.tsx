import { AllNote } from "../Component/AllNote"
import { Banner2 } from "../Component/Banner2"
import { Footer } from "../Component/Footer"
import { Header } from "../Component/Header"


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
