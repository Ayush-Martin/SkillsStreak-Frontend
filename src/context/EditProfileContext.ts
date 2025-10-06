import { UserProfileSchemaType } from "@/validation/user.validation";
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
  register: UseFormRegister<UserProfileSchemaType>;
  errors: FieldErrors<UserProfileSchemaType>;
  setValues: UseFormSetValue<UserProfileSchemaType>;
  trigger: UseFormTrigger<UserProfileSchemaType>;
  watch: UseFormWatch<UserProfileSchemaType>;
  control: Control<UserProfileSchemaType>;
  setValue: UseFormSetValue<UserProfileSchemaType>;
  setError: UseFormSetError<UserProfileSchemaType>;
  clearErrors: UseFormClearErrors<UserProfileSchemaType>;
  profileImageChangeHandler: (
    event: ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
}
const EditProfileContext = createContext<IEditProfileContext | undefined>(
  undefined
);

export default EditProfileContext;
