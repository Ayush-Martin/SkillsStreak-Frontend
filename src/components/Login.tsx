import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ErrorText from "./ErrorText";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginApi } from "@/api/authApi";
import { AppDispatch } from "@/store";
import { login } from "../features/Auth/userSlice";
import { useDispatch } from "react-redux";
import { LoginSchema, LoginSchemaType } from "../validators/authValidator";

const Login = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    trigger,
  } = useForm<LoginSchemaType>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    const res = await loginApi(data);
    dispatch(login(res));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Input
          placeholder="Email"
          className="bg-app-highlight"
          {...register("email")}
          onBlur={() => trigger("email")}
        />

        {errors.email?.message && <ErrorText error={errors.email?.message} />}
      </div>

      <div>
        <Input
          placeholder="Password"
          type="password"
          className="bg-app-highlight"
          {...register("password")}
          onBlur={() => trigger("password")}
        />
        {errors.password?.message && (
          <ErrorText error={errors.password?.message} />
        )}
      </div>

      <Button variant={"v1"} size={"full"} disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center text-app-neutral">Or</p>

      <Button variant={"v2"} size={"full"}>
        Login with Google
      </Button>
    </form>
  );
};

export default Login;
