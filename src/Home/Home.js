// src/Home/Home.js
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import SearchBar from "../search/SearchBar";

// 🤖 챗봇 UI (프로젝트 구조 그대로 사용)
import ChatbotButton from "../chat/ChatbotButton.jsx";
import ChatbotPanel from "../chat/ChatbotPanel.jsx";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  // 지도 위 건물들
  const buildings = useMemo(
    () => [
      { key: "Moria", name: "모리아관", path: "/Moria" },
      { key: "galmel", name: "갈멜관", path: "/galmel" },
      { key: "bogeum", name: "복음관", path: "/Bogeum" },
      { key: "milal", name: "밀알관", path: "/Milal" },
      { key: "illipA", name: "일립관A", path: "/IllipA" },
      { key: "illipB", name: "일립관B", path: "/IllipB" },
    ],
    []
  );

  // 검색창 입력값으로 지도 라벨만 로컬 필터
  const filtered = query.trim()
    ? buildings.filter((b) =>
      b.name.toLowerCase().includes(query.trim().toLowerCase())
    )
    : buildings;

  // 서버 검색 API (강의실/과목 → 건물·층·강의실 정보 리턴)
  const serverSuggest = async (q) => {
    const t = (q || "").trim();
    if (!t) return [];
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(t)}`);
      if (!res.ok) return [];
      // 기대 포맷: [{type:'room'|'course'|'building', label, buildingPath, building, floor, room}, ...]
      return await res.json();
    } catch (e) {
      console.error("검색 API 실패", e);
      return [];
    }
  };

  // 검색 항목 선택 시 이동 규칙 (친구가 올린 로직 그대로 유지)
  const handleSelect = (item) => {
    if (!item) return;

    // 강의실/과목 결과 → 해당 건물로 이동하며 ?floor=&room= 세팅
    if (item.type === "room" || item.type === "course") {
      const path = item.buildingPath;
      if (!path) return;
      const qs = new URLSearchParams();
      if (item.floor != null) qs.set("floor", String(item.floor));
      if (item.room) qs.set("room", item.room);
      const queryString = qs.toString();
      navigate(queryString ? `${path}?${queryString}` : path);
      return;
    }

    // 건물만 온 경우
    if (item.type === "building" && item.buildingPath) {
      navigate(item.buildingPath);
    }
  };

  return (
    <div className="home">
      <header className="home__header">
        <div className="home__logo">
          <img
            src="%PUBLIC_URL%/uninavi2.png"
            alt="유니나비 로고"
            className="home__logo-img"
          />
        </div>

        <SearchBar
          placeholder="과목명 검색"
          onSelect={handleSelect}
          onQueryChange={setQuery}     // 지도 라벨 로컬 필터링
          extraSuggest={serverSuggest} // 서버 자동완성/검색
        />
      </header>

      {/* 지도 */}
      <section className="map">
        {/* 배경/데코 */}
        <div className="map__bg" />
        <div className="map__circle" />
        <div className="map__field map__field--small" />
        <div className="map__field map__field--large" />
        <div className="map__curb" />
        <div className="map__thin-rail" />
        <div className="jacob-ladder">
          야곱의
          <br />
          사닥다리
        </div>
        <div className="map__parking">P</div>
        <div className="map__gate-box map__gate--front">정문</div>
        <div className="map__gate-box map__gate--back">후문</div>

        {/* 건물 라벨 */}
        {filtered.map((b) => (
          <Link key={b.key} to={b.path} className={`bld bld--${b.key}`} aria-label={b.name}>
            {b.name}
          </Link>
        ))}
      </section>

      {/* 🤖 챗봇 플로팅 버튼 & 패널 */}
      <ChatbotButton onClick={() => setChatOpen(true)} />
      <ChatbotPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}