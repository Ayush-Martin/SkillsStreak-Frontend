import UserLayout from "@/layouts/UserLayout";
import { Link } from "react-router-dom";

const home = () => {
  return (
    <div className="bg-app-primary">
      {/* <UserLayout>Home</UserLayout> */}
      <div className="flex flex-col gap-2 text-white">
        <Link to={"/auth"}>auth</Link>
        <Link to={"/trainer"}>Trainer</Link>
        <Link to={"/admin"}>Admin</Link>
        <Link to={"/premium"}>Premium</Link>
        <Link to={"/"}>Home</Link>
        <Link to={"/user"}>User</Link>
      </div>
    </div>
  );
};

export default home;
