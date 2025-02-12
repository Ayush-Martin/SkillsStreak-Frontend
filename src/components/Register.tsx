import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Register = () => {
  return (
    <>
      <Input placeholder="username" className="bg-app-highlight" />
      <Input placeholder="email" className="bg-app-highlight" />
      <Input placeholder="password" className="bg-app-highlight" />
      <Button variant={"v1"} size={"full"}>
        Register
      </Button>
      <p className="text-center text-app-neutral">Or</p>
      <Button variant={"v2"} size={"full"}>
        Register with google
      </Button>
    </>
  );
};

export default Register;
