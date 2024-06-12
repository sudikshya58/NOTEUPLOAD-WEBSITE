import { ReactElement } from "react";
import { Banner } from "./index.js";
interface BannerType {
  icon: ReactElement;
  title: string;
  description: string;
}
export const Banner2: React.FC = () => {
  return (
    <>
      <div className="flex justify-between p-3 gap-20  mt-40 ">
        {Banner.map((item: BannerType, index: number) => (
          <div
            key={index}
            className="banner-item p-6 bg-[#0F26F4] bg-opacity-10 rounded "
          >
            <div></div>
            <h1 className="font-bold text-[24px] mb-3">{item.title}</h1>
            <p className="text-gray-600 font-medium text-[24px]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
