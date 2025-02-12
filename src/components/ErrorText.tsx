import React from "react";

const ErrorText = ({ error }: { error: string }) => {
  return <p className="text-sm text-red-500">{error}</p>;
};

export default ErrorText;
