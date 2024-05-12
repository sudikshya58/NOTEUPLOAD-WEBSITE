import { Background } from "../Component/Background"
import { Header } from "../Component/Header"
import { NoteDesign } from "../Component/NoteDesign"

export const Homepage = () => {
  return (
    <div>
  <Header/>
  <Background/>
  <div className="mx-36">
  <NoteDesign/>
  </div>
  </div>
  )
}
