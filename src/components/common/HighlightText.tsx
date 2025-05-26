import React, { FC } from "react";

interface IHighlightTextProps {
  text: string;
  search: string;
}

const HighlightText: FC<IHighlightTextProps> = ({ text, search }) => {
  if (!search) return <>{text}</>;

  const regex = new RegExp(`(${search})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="text-blue-700 font-semibold">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

export default HighlightText;
