import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import "../styles/MainPage.css";
import ScholarshipCard from "../components/ScholarshipCard";

function App() {
  const navigate = useNavigate();

  // sessionStorage에서 초기 상태 로드
  const [scholarships, setScholarships] = useState([]);
  const [searchTerm, setSearchTerm] = useState(
    () => sessionStorage.getItem("searchTerm") || ""
  );
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [user, setUser] = useState(null);
  const [locationState, setLocationState] = useState(
    () => sessionStorage.getItem("locationState") || ""
  );
  const [educationLevel, setEducationLevel] = useState(
    () => sessionStorage.getItem("educationLevel") || ""
  );
  const [incomeLevel, setIncomeLevel] = useState(
    () => Number(sessionStorage.getItem("incomeLevel")) || 10
  );

  // 마감된 장학금 표시 여부
  const [showClosed, setShowClosed] = useState(false);

  // 기본 정렬 옵션을 createdAt으로 (추가 순), 최근 추가된 데이터가 위로 오도록 정렬
  const [sortOption, setSortOption] = useState("createdAt");

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === "admin@admin.com") {
        navigate("/admin"); // 어드민 페이지로 리디렉션
      }
    });

    return () => unsubscribe();
  }, [navigate, auth]);

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
    let updatedList = scholarships.filter((item) => {
      const matchesSearchTerm = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const itemIncomeLevel = Number(item.incomeLevel);
      const matchesIncomeLevel = itemIncomeLevel <= incomeLevel;

      const matchesLocation =
        locationState.trim() === "" ||
        (item.location &&
          item.location.toLowerCase().includes(locationState.toLowerCase()));

      const matchesEducation =
        educationLevel.trim() === "" ||
        (item.educationLevel &&
          item.educationLevel
            .toLowerCase()
            .includes(educationLevel.toLowerCase()));

      // 마감 여부 판단
      const isClosed = new Date(item.deadline) < new Date();
      const matchesClosed = showClosed || !isClosed; // showClosed가 false면 마감 안된것만, true면 모두 표시

      return (
        matchesSearchTerm &&
        matchesIncomeLevel &&
        matchesLocation &&
        matchesEducation &&
        matchesClosed
      );
    });

    // 정렬 로직
    updatedList = updatedList.sort((a, b) => {
      if (sortOption === "deadline") {
        // 마감일 빠른 순 (과거 -> 미래)
        const dateA = new Date(a.deadline);
        const dateB = new Date(b.deadline);
        return dateA - dateB;
      } else if (sortOption === "createdAt") {
        // 최근에 추가된 데이터가 위로 (내림차순 정렬)
        const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
        return dateB - dateA; // createdAt 날짜가 큰(최근) 것 먼저
      }
      return 0;
    });

    setFilteredScholarships(updatedList);
  }, [
    searchTerm,
    scholarships,
    incomeLevel,
    locationState,
    educationLevel,
    showClosed,
    sortOption,
  ]);

  // 상태 변경 시 sessionStorage 업데이트
  useEffect(() => {
    sessionStorage.setItem("searchTerm", searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    sessionStorage.setItem("locationState", locationState);
  }, [locationState]);

  useEffect(() => {
    sessionStorage.setItem("educationLevel", educationLevel);
  }, [educationLevel]);

  useEffect(() => {
    sessionStorage.setItem("incomeLevel", incomeLevel);
  }, [incomeLevel]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload(); // 로그아웃 후 페이지 리프레시
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };

  const handleNavigateToDetail = (id) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div className="container">
      <nav className="top-nav">
        <div className="nav-left">
          {user && <span>환영합니다, {user.email}님</span>}
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <button className="outline" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button className="outline" onClick={() => navigate("/login")}>
                로그인
              </button>
              <button className="outline" onClick={() => navigate("/register")}>
                회원가입
              </button>
            </>
          )}
        </div>
      </nav>

      <header className="page-header">
        <h1>메인 페이지</h1>
        {user && (
          <button
            className="favorite-history outline"
            onClick={() => navigate("/favorites")}
          >
            즐겨찾기 기록
          </button>
        )}
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
          <input
            type="text"
            placeholder="지역을 입력하세요"
            value={locationState}
            onChange={(e) => setLocationState(e.target.value)}
          />

          <h2>학력</h2>
          <input
            type="text"
            placeholder="학력을 입력하세요"
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value)}
          />

          <h2>소득분위</h2>
          <p style={{ textAlign: "center" }}>(1 ~ {incomeLevel})</p>
          <input
            type="range"
            min="1"
            max="10"
            value={incomeLevel}
            onChange={(e) => setIncomeLevel(Number(e.target.value))}
          />

          <label>
            <input
              type="checkbox"
              checked={showClosed}
              onChange={(e) => setShowClosed(e.target.checked)}
            />{" "}
            마감된 장학금 확인
          </label>

          <h2>정렬 옵션</h2>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="createdAt">추가순 (최신순)</option>
            <option value="deadline">마감일순</option>
          </select>
        </aside>

        <main className="scholarship-list">
          {filteredScholarships.map((item) => (
            <ScholarshipCard
              key={item.id}
              item={item}
              onClick={() => handleNavigateToDetail(item.id)}
            />
          ))}
        </main>
      </div>
    </div>
  );
}

export default App;
