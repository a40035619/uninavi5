import { useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home/Home";
import Moria from "./Moria/Moria";
import Galmel from "./galmel";
import Bogeum from "./pages/Bogeum/Bogeum";
import IllipA from "./pages/IllipA/IllipA";
import IllipB from "./pages/IllipB/IllipB";
import Milal from "./pages/Milal/Milal";

console.log("Galmel:", Galmel);

function setScreenSize() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

export default function App() {
  useEffect(() => {
    setScreenSize();
    window.addEventListener("resize", setScreenSize);
    return () => window.removeEventListener("resize", setScreenSize);
  }, []);

  return (
    <Router>
      <Routes>
        {/* 🔹 기본 진입 시 /uninavi로 보내기 */}
        <Route path="/" element={<Navigate to="/uninavi" replace />} />
        <Route path="/uninavi" element={<Home />} />

        {/* 🔹 건물별 라우트 */}
        <Route path="/moria" element={<Moria />} />
        <Route path="/galmel" element={<Galmel />} />
        <Route path="/bogeum" element={<Bogeum />} />
        <Route path="/IllipA" element={<IllipA />} />
        <Route path="/IllipB" element={<IllipB />} />
        <Route path="/milal" element={<Milal />} />

        {/* 🔹 잘못된 경로는 무조건 /uninavi로 */}
        <Route path="*" element={<Navigate to="/uninavi" replace />} />
      </Routes>
    </Router>
  );
}
