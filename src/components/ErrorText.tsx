import { FC } from "react";

interface IErrorTextProps {
  error: string;
}

const ErrorText: FC<IErrorTextProps> = ({ error }) => {
  return <p className="text-sm text-red-500">{error}</p>;
};

export default ErrorText;
