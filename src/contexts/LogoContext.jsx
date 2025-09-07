import { createContext, useContext, useState, useEffect } from "react";

const LogoContext = createContext();

export function LogoProvider({ children }) {
  const [logo, setLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [logoSize, setLogoSize] = useState(32); // Default size in pixels

  // Load logo and size from localStorage on mount
  useEffect(() => {
    const savedLogo = localStorage.getItem("uploadedLogo");
    const savedLogoUrl = localStorage.getItem("logoUrl");
    const savedLogoSize = localStorage.getItem("logoSize");

    if (savedLogoUrl) {
      setLogoUrl(savedLogoUrl);
    }
    if (savedLogoSize) {
      setLogoSize(parseInt(savedLogoSize));
    }
  }, []);

  const updateLogo = (file) => {
    setLogo(file);

    // Create URL for the file
    const url = URL.createObjectURL(file);
    setLogoUrl(url);

    // Save to localStorage
    localStorage.setItem("logoUrl", url);

    // In a real app, you would upload to a server here
    // For now, we'll just store the file name
    localStorage.setItem("uploadedLogo", file.name);
  };

  const updateLogoSize = (size) => {
    setLogoSize(size);
    localStorage.setItem("logoSize", size.toString());
  };

  const clearLogo = () => {
    setLogo(null);
    setLogoUrl(null);
    setLogoSize(32);
    localStorage.removeItem("uploadedLogo");
    localStorage.removeItem("logoUrl");
    localStorage.removeItem("logoSize");
  };

  return (
    <LogoContext.Provider
      value={{ logo, logoUrl, logoSize, updateLogo, updateLogoSize, clearLogo }}
    >
      {children}
    </LogoContext.Provider>
  );
}

export function useLogo() {
  const context = useContext(LogoContext);
  if (!context) {
    throw new Error("useLogo must be used within a LogoProvider");
  }
  return context;
}
