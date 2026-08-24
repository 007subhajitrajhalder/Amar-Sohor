import { useEffect, useState } from "react";

const ADMIN_THEME_KEY = "amar-sohor-admin-theme";

function getInitialLightMode() {
  return localStorage.getItem(ADMIN_THEME_KEY) === "light";
}

export function useAdminTheme() {
  const [isLightMode, setIsLightMode] = useState(getInitialLightMode);

  useEffect(() => {
    document.body.style.backgroundColor = isLightMode ? "#faf8f2" : "#100e0b";
    document.body.style.transition = "background-color 700ms ease";
    localStorage.setItem(ADMIN_THEME_KEY, isLightMode ? "light" : "dark");

    return () => {
      document.body.style.backgroundColor = "#100e0b";
      document.body.style.transition = "";
    };
  }, [isLightMode]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === ADMIN_THEME_KEY) {
        setIsLightMode(event.newValue === "light");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return [isLightMode, setIsLightMode];
}
