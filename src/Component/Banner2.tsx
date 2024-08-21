import React from "react";
import { Banner } from "../Page/index.js";
import { ContentDoc } from "./index.js";

const { title, description } = ContentDoc[0];

interface BannerType {
  icon: string;
  title: string;
  description: string;
}

export const Banner2: React.FC = () => {
  return (
    <>
      <div className="w-full flex flex-col md:flex-row mt-20 md:gap-6 lg:gap-20">
        {/* Text Section */}
        <div className="flex flex-col w-full md:w-3/4 p-4 ">
          <h1 className="font-bold text-black text-2xl sm:text-xl md:text-xl lg:text-2xl  w-full mb-4">{title}</h1>
          <p className="font-medium text-gray-500 text-lg md:text-xl mb-6 text-justify">{description}</p>
          <button className="w-full md:w-40 text-lg p-4 rounded text-white font-bold bg-[#003479]">
            Learn More
          </button>
        </div>

        {/* Image Section */}
        <div className="hidden md:flex md:w-1/2 sm:items-center sm:justify-center">
  <img
    src="https://img.freepik.com/free-vector/happy-woman-sitting-talking-each-other_1308-93633.jpg?t=st=1716966527~exp=1716970127~hmac=1ca05aae04339147eb96f3d8e536d7b58f9cbd083599061be6cba3cd30875d7c&w=826"
    alt="Happy woman"
    className="w-full lg:h-auto  object-cover"
  />
</div>

      </div>

      {/* Banner Section */}
      <div className="flex flex-col md:flex-row justify-between p-4  gap-4 md:gap-8 mt-10">
        {Banner.map((item: BannerType, index: number) => (
          <div
            key={index}
            className="banner-item p-6  bg-[#0F26F4] w-full md:w-[30rem] bg-opacity-10 rounded"
          >
            <div className="flex w-full items-center justify-center mb-2">
              {item.icon && <img src={item.icon} alt="icon" className="h-10 w-10" />}
            </div>
            <h1 className="font-bold text-center text-[20px]  md:text-[16px] mb-2">{item.title}</h1>
            <p className="text-gray-600 font-medium text-justify  text-sm md:text-[12px] lg:text-[16px]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
