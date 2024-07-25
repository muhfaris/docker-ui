// src/hooks/useAuthRedirect.tsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useAuthRedirect = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("access_token");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated;
};

export default useAuthRedirect;
