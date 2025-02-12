import axios from "axios";
import {
  LoginSchemaType,
  RegisterSchemaType,
} from "@/validators/authValidator";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { successPopup, errorPopup } from "../utils/popup";

export const loginApi = async (
  body: LoginSchemaType
): Promise<string | void> => {
  try {
    const response = await axios.post("http://localhost:5000/auth/login", body);
    const res = response.data as IResponse;
    successPopup(res.message!);
    return res.data!;
  } catch (err) {
    const resErr = err as IApiResponseError;
    errorPopup(resErr.response.data.error!);
  }
};

export const RegisterApi = async (body: RegisterSchemaType): Promise<void> => {
  try {
    const response = await axios.post(
      "http://localhost:5000/auth/register",
      body
    );
    const res = response.data as IResponse;
    successPopup(res.message!);
  } catch (err) {
    const resErr = err as IApiResponseError;
    errorPopup(resErr.response.data.error!);
  }
};
