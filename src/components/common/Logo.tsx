import { LogoImage } from "@/assets/images";
import { FC } from "react";

const Logo: FC = () => {
  return (
    <img
      src={LogoImage}
      alt=""
      className="object-contain w-[90px] w-md-[130px]"
    />
  );
};

export default Logo;
