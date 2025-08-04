import { useEffect, useRef } from "react";

const useScrollToBottom = (dependencies: React.DependencyList) => {
  const componentEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    componentEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [...dependencies]);

  return componentEndRef;
};

export default useScrollToBottom;
