import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterSchemaType } from "@/validators/authValidator";
import ErrorText from "./ErrorText";
import { RegisterApi } from "@/api/authApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
    trigger,
  } = useForm<RegisterSchemaType>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(RegisterSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterSchemaType) => {
    console.log(data);
    await RegisterApi(data);
    navigate("/verifyOTP", {
      state: {
        email: data.email,
        forAction: "register",
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Input
          placeholder="username"
          className="bg-app-highlight"
          {...register("username")}
          onBlur={() => trigger("username")}
        />
        {errors.username && <ErrorText error={errors.username.message!} />}
      </div>
      <div>
        <Input
          placeholder="email"
          className="bg-app-highlight"
          {...register("email")}
          onBlur={() => trigger("email")}
        />
        {errors.email && <ErrorText error={errors.email.message!} />}
      </div>
      <div>
        <Input
          placeholder="password"
          className="bg-app-highlight"
          {...register("password")}
          onBlur={() => trigger("password")}
        />
        {errors.password && <ErrorText error={errors.password.message!} />}
      </div>
      <Button variant={"v1"} size={"full"} disabled={isSubmitting || !isValid}>
        {isSubmitting ? "Registering in..." : "Register"}
      </Button>
      <p className="text-center text-app-neutral">Or</p>
      <Button variant={"v2"} size={"full"}>
        Register with google
      </Button>
    </form>
  );
};

export default Register;
