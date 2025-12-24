import { useEffect } from "react";

const ExternalRedirect = ({ to }) => {
  useEffect(() => {
    const target = to || "http://localhost:5173";
    window.location.replace(target);
  }, [to]);

  return null;
};

export default ExternalRedirect;
