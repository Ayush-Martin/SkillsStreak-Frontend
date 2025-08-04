import { IUserProfileSchema } from "@/hooks/useEditProfile";
import { ChangeEvent, createContext } from "react";
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";

interface IEditProfileContext {
  register: UseFormRegister<IUserProfileSchema>;
  errors: FieldErrors<IUserProfileSchema>;
  setValues: UseFormSetValue<IUserProfileSchema>;
  trigger: UseFormTrigger<IUserProfileSchema>;
  watch: UseFormWatch<IUserProfileSchema>;
  control: Control<IUserProfileSchema>;
  setValue: UseFormSetValue<IUserProfileSchema>;
  setError: UseFormSetError<IUserProfileSchema>;
  clearErrors: UseFormClearErrors<IUserProfileSchema>;
  profileImageChangeHandler: (
    event: ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
}
const EditProfileContext = createContext<IEditProfileContext | undefined>(
  undefined
);

export default EditProfileContext;
