import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import ScholarshipCard from "../components/ScholarshipCard";
import "../styles/MainPage.css"; // 메인 페이지와 동일한 스타일 사용

function FavoritesPage() {
  const auth = getAuth();

  // sessionStorage에서 초기 상태 로드 (메인 페이지와 동일한 패턴)
  const [favoriteScholarships, setFavoriteScholarships] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);

  const [user, setUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState(
    () => sessionStorage.getItem("searchTerm_fav") || ""
  );
  const [locationState, setLocationState] = useState(
    () => sessionStorage.getItem("locationState_fav") || ""
  );
  const [educationLevel, setEducationLevel] = useState(
    () => sessionStorage.getItem("educationLevel_fav") || ""
  );
  const [incomeLevel, setIncomeLevel] = useState(
    () => Number(sessionStorage.getItem("incomeLevel_fav")) || 10
  );

  // 마감된 장학금 표시 여부
  const [showClosed, setShowClosed] = useState(false);

  // 기본 정렬 옵션: createdAt으로 (추가 순, 최신순)
  const [sortOption, setSortOption] = useState("createdAt");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchFavoriteScholarships = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        // 사용자 문서에서 즐겨찾기 ID 가져오기
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const favorites = userDocSnap.data().favorites || [];
          if (favorites.length === 0) {
            setFavoriteScholarships([]);
            setFilteredFavorites([]);
            return;
          }

          // 즐겨찾기 ID로 장학금 데이터 가져오기
          const scholarshipsRef = collection(db, "scholarships");
          const q = query(scholarshipsRef, where("__name__", "in", favorites));
          const querySnapshot = await getDocs(q);
          const favoriteScholarshipsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setFavoriteScholarships(favoriteScholarshipsData);
          setFilteredFavorites(favoriteScholarshipsData);
        }
      } catch (error) {
        console.error("즐겨찾기 장학금 불러오기 오류:", error);
      }
    };

    fetchFavoriteScholarships();
  }, [auth]);

  useEffect(() => {
    let updatedList = favoriteScholarships.filter((item) => {
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
      const matchesClosed = showClosed || !isClosed;

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
        const dateA = new Date(a.deadline);
        const dateB = new Date(b.deadline);
        return dateA - dateB; // 마감일 빠른 순
      } else if (sortOption === "createdAt") {
        const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
        return dateB - dateA; // 최신순 (최근 추가된 것 위)
      }
      return 0;
    });

    setFilteredFavorites(updatedList);
  }, [
    favoriteScholarships,
    searchTerm,
    locationState,
    educationLevel,
    incomeLevel,
    showClosed,
    sortOption,
  ]);

  // 상태 변경 시 sessionStorage 업데이트
  useEffect(() => {
    sessionStorage.setItem("searchTerm_fav", searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    sessionStorage.setItem("locationState_fav", locationState);
  }, [locationState]);

  useEffect(() => {
    sessionStorage.setItem("educationLevel_fav", educationLevel);
  }, [educationLevel]);

  useEffect(() => {
    sessionStorage.setItem("incomeLevel_fav", incomeLevel);
  }, [incomeLevel]);

  const handleLogout = async () => {
    const authInstance = getAuth();
    try {
      await signOut(authInstance);
      window.location.href = "/login"; // navigate 대체
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };

  // 여기서는 메인 페이지와 달리 detail페이지 이동 코드가 없지만, 필요하다면 구현
  const handleNavigateToDetail = (id) => {
    window.location.href = `/detail/${id}`;
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
              <button
                className="outline"
                onClick={() => (window.location.href = "/login")}
              >
                로그인
              </button>
              <button
                className="outline"
                onClick={() => (window.location.href = "/register")}
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </nav>

      <header className="page-header">
        <h1>즐겨찾기 페이지</h1>
        {user && (
          <button
            className="favorite-history outline"
            onClick={() => window.history.back()}
          >
            메인 페이지
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
        {/* 즐겨찾기 페이지에서 추가 버튼이 필요 없을 수 있지만,
            메인 페이지와 동일한 레이아웃을 원한다면 그대로 둡니다. */}
        <button
          className="add-button"
          onClick={() => (window.location.href = "/add")}
        >
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
          {filteredFavorites.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              item={scholarship}
              onClick={() => handleNavigateToDetail(scholarship.id)}
            />
          ))}
        </main>
      </div>
    </div>
  );
}

export default FavoritesPage;
