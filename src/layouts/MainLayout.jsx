import { Outlet } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import RoleBasedSidebar from "../components/RoleBasedSidebar";
import Navbar from "../components/Navbar";
import { getStoredUser, hasAuthToken, logoutUser } from "../services/api";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser());
  const [authenticated, setAuthenticated] = useState(hasAuthToken());
  const [darkMode, setDarkMode] = useState(true);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [uploadedMaterials, setUploadedMaterials] = useState([]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (darkMode) {
      root.classList.add("dark");
      body.classList.remove("light");
      localStorage.setItem("ati_theme", "dark");
    } else {
      root.classList.remove("dark");
      body.classList.add("light");
      localStorage.setItem("ati_theme", "light");
    }
  }, [darkMode]);

  const toggleShortlistCandidate = (candidate) => {
    setShortlistedCandidates((prev) => {
      const exists = prev.some((item) => item.id === candidate.id);
      if (exists) return prev.filter((item) => item.id !== candidate.id);
      return [...prev, candidate];
    });
  };

  const addUploadedMaterial = (material) => {
    setUploadedMaterials((prev) => [{ id: Date.now(), ...material }, ...prev]);
  };

  const contextValue = useMemo(
    () => ({
      user,
      authenticated,
      setUser,
      setAuthenticated,
      darkMode,
      setDarkMode,
      shortlistedCandidates,
      toggleShortlistCandidate,
      uploadedMaterials,
      addUploadedMaterial
    }),
    [user, authenticated, darkMode, shortlistedCandidates, uploadedMaterials]
  );

  const handleLogout = () => {
    logoutUser();
    setAuthenticated(false);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="glow-blob left-[-6rem] top-[-7rem] bg-pink-300" />
      <div className="glow-blob right-[-5rem] top-[18%] bg-violet-300" />
      <div className="glow-blob bottom-[-8rem] left-[26%] bg-sky-300" />
      <div className="grain-overlay" />
      <RoleBasedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={user} />
      <div className="relative z-10 lg:pl-72">
        <Navbar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          user={user}
          authenticated={authenticated}
          onLogout={handleLogout}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((prev) => !prev)}
        />
        <main className="p-4 sm:p-6">
          <Outlet context={contextValue} />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
