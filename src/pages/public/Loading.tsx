import AuthLayout from "@/layouts/AuthLayout";
import { FourSquare } from "react-loading-indicators";

const Loading = () => {
  return (
    <AuthLayout>
      <FourSquare
        color="#F2A104"
        size="large"
        text="Loading ..."
        textColor="#F2A104"
      />
    </AuthLayout>
  );
};

export default Loading;
