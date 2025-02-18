import UserLayout from "@/layouts/UserLayout";
import { Link } from "react-router-dom";
import appApi from "@/config/axios";

const home = () => {
  const sampleResponse = async () => {
    const res=await appApi.get("/auth/sample");
    console.log(res);
  };
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

        <button onClick={sampleResponse}>sample</button>
      </div>
    </div>
  );
};

export default home;
