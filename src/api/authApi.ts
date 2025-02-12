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
    const response = await axios.post(
      "http://localhost:5000/auth/login",
      body,
      {
        withCredentials: true,
      }
    );
    const res = response.data as IResponse;
    successPopup(res.message!);
    return res.data!;
  } catch (err) {
    const resErr = err as IApiResponseError;
    errorPopup(resErr.response.data.error!);
  }
};

export const RegisterApi = async (
  body: RegisterSchemaType
): Promise<boolean | void> => {
  try {
    const response = await axios.post(
      "http://localhost:5000/auth/register",
      body
    );
    const res = response.data as IResponse;
    successPopup(res.message!);
    return true;
  } catch (err) {
    const resErr = err as IApiResponseError;
    errorPopup(resErr.response.data.error!);
  }
};

export const CompleteRegisterApi = async (body: {
  email: string;
  OTP: string;
}): Promise<boolean | void> => {
  try {
    const response = await axios.post(
      "http://localhost:5000/auth/completeRegister",
      body
    );
    const res = response.data as IResponse;
    successPopup(res.message!);
    return true;
  } catch (err) {
    const resErr = err as IApiResponseError;
    errorPopup(resErr.response.data.error!);
  }
};

export const ForgetPasswordApi = async (body: {
  email: string;
}): Promise<boolean | void> => {
  try {
    const response = await axios.post(
      "http://localhost:5000/auth/forgetPassword",
      body
    );
    const res = response.data as IResponse;
    successPopup(res.message!);
    return true;
  } catch (err) {
    const resErr = err as IApiResponseError;
    errorPopup(resErr.response.data.error!);
  }
};

export const ResetPasswordApi = async (body: {
  email: string;
  password: string;
}): Promise<boolean | void> => {
  try {
    const response = await axios.post(
      "http://localhost:5000/auth/resetPassword",
      body
    );
    console.log(response);
    const res = response.data as IResponse;
    successPopup(res.message!);
    return true;
  } catch (err) {
    const resErr = err as IApiResponseError;
    errorPopup(resErr.response.data.error!);
  }
};

export const VerifyOTPApi = async (body: {
  email: string;
  OTP: string;
}): Promise<boolean | void> => {
  try {
    const response = await axios.post(
      "http://localhost:5000/auth/verifyOTP",
      body
    );
    const res = response.data as IResponse;
    successPopup(res.message!);
    return true;
  } catch (err) {
    const resErr = err as IApiResponseError;
    errorPopup(resErr.response.data.error!);
  }
};
