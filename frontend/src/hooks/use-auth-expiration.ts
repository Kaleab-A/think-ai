import { useEffect } from "react";
import { useStore } from "@/store/store";

const useAuthExpiration = () => {
  const {
    accessToken,
    expiresAt,
    clearAccessToken,
    clearUser,
    clearExpiresAt,
  } = useStore();

  useEffect(() => {
    const handleLogout = () => {
      console.log("Token expired, logging out...");
      clearUser();
      clearAccessToken();
      clearExpiresAt();
    };

    if (accessToken && expiresAt) {
      const currentTime = Date.now();
      const timeUntilExpiration = expiresAt - currentTime;

      if (timeUntilExpiration <= 0) {
        // Token is already expired
        handleLogout();
      } else {
        // Set a timeout to log out the user when the token expires
        const timer = setTimeout(handleLogout, timeUntilExpiration);
        // Cleanup the timer on component unmount or token change
        return () => clearTimeout(timer);
      }
    }
  }, [accessToken, clearAccessToken, clearExpiresAt, clearUser, expiresAt]);
};

export default useAuthExpiration;
