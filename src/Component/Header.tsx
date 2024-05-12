import { Link } from "react-router-dom";
import {Navitem} from "../Page/index.js";
export const Header = () => {
  return (
  <div className="">
    <nav className="p-6 bg-white shadow-xl">
      <ul className="flex justify-between mx-32">
        <li>logo</li>
      <li className="flex justify-between gap-60 cursor-pointer font-bold">
          {Navitem.map((item,index:number)=>(
          <Link to={item.path}>  <li key={index}>{item.name}</li> </Link>
          ))}
          
        </li>
      </ul>
    </nav>
  </div>
  )
}
