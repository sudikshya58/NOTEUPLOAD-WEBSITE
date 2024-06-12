import { FcBullish } from "react-icons/fc";
import { DashboardLinks } from "../Page/index.js";
import { Link } from "react-router-dom";
export const DashboardSidebar = () => {
  return (
    <div className="flex flex-col bg-black h-[100vh] w-60">
        <div className="flex flex-row">
        <FcBullish size={24}/>
        <span  className='text-black text-lg'>Dashboard_view</span>
        </div>
        <div className="mt-20">
          {DashboardLinks.map((item,i)=>(
            <div key={i} className=" mb-10">
              <Link to="">
                <div className="flex justify-center ">
                  <div>icon</div>
                  <div className="text-white font-medium text-[20px]">{item.label}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
    </div>
  )
}
