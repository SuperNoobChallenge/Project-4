import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; // Firebase 설정 파일에서 db를 가져옵니다.
import { collection, getDocs } from "firebase/firestore"; // 여기서 collection과 getDocs를 가져옵니다.
import "../styles/MainPage.css";
import ScholarshipCard from "../components/ScholarshipCard";

function App() {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredScholarships, setFilteredScholarships] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "scholarships"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setScholarships(data);
      setFilteredScholarships(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredScholarships(
      scholarships.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, scholarships]);

  return (
    <div className="container">
      <nav className="top-nav">
        <div className="nav-left">
          {/* 필요한 경우 좌측에 추가 콘텐츠를 넣을 수 있습니다 */}
        </div>
        <div className="nav-right">
          <button className="outline" onClick={() => navigate("/login")}>
            로그인
          </button>
          <button className="outline" onClick={() => navigate("/register")}>
            회원가입
          </button>
        </div>
      </nav>

      <header className="page-header">
        <h1>메인 페이지</h1>
        <button
          className="favorite-history outline"
          onClick={() => navigate("/favorites")}
        >
          즐겨찾기 기록
        </button>
      </header>

      <div className="search-add">
        <input
          type="text"
          className="search-input"
          placeholder="검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="add-button" onClick={() => navigate("/add")}>
          +
        </button>
      </div>

      <div className="content">
        <aside className="filters">
          <h2>지역 설정</h2>
          <select>
            <option>대전</option>
          </select>

          <h2>학력</h2>
          <select>
            <option>대학생</option>
          </select>

          <h2>소득분위</h2>
          <input type="range" min="1" max="10" />

          <label>
            <input type="checkbox" /> 마감 기록 확인
          </label>

          <button className="search-button">검색</button>
        </aside>

        <main className="scholarship-list">
          {filteredScholarships.map((item) => (
            <ScholarshipCard key={item.id} item={item} />
          ))}
        </main>
      </div>
    </div>
  );
}

export default App;
