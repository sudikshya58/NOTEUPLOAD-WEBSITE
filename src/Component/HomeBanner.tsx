import {ContentDoc} from "./index.js";

export const HomeBanner = () => {
    const {title,description}=ContentDoc[0];
    console.log(ContentDoc);
  return (
    <div className="mt-32   flex justify-between items-center  gap-12">
        <div className="basis-[50%] flex flex-col mt-10 ">
            <h1 className='font-bold  text-black h-10 text-[32px] mb-8'>{title}</h1>
            <p className='font-medium text-gray-500 text-[28px] mb-8 text-justify'>{description}</p>
            <button className='w-40 text-[20px] p-4 rounded text-white font-bold bg-[#003479] '>Learn More</button>
        </div>
        <div className="basis-[50%]">
          <img src="https://img.freepik.com/free-vector/happy-woman-sitting-talking-each-other_1308-93633.jpg?t=st=1716966527~exp=1716970127~hmac=1ca05aae04339147eb96f3d8e536d7b58f9cbd083599061be6cba3cd30875d7c&w=826" alt=""  />
        </div>
    </div>
  )
}
