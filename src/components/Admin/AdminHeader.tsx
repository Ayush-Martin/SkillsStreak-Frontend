import { Header, Logo, Notification } from "@/components";
import { Button } from "@/components/ui";
import useLogout from "@/hooks/useLogout";
import { FC } from "react";

const AdminHeader: FC = () => {
  const { logoutHandler } = useLogout();
  return (
    <Header>
      <div className="hidden w-24 sm:block"></div>
      <Logo />

      <div className="flex items-center gap-4">
        <Notification />
        <Button variant={"v2"} className="" onClick={logoutHandler}>
          Logout
        </Button>
      </div>
    </Header>
  );
};

export default AdminHeader;
