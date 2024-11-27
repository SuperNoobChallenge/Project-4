import React from "react";
import "../styles/MainPage.css";

function App() {
  return (
    <div className="container">
      <nav className="top-nav">
        <div className="nav-left">
          {/* 필요한 경우 좌측에 추가 콘텐츠를 넣을 수 있습니다 */}
        </div>
        <div className="nav-right">
          <button className="outline">로그인</button>
          <button className="outline">회원가입</button>
        </div>
      </nav>

      <header className="page-header">
        <h1>메인 페이지</h1>
        <button className="favorite-history outline">즐겨찾기 기록</button>
      </header>

      {/* 검색 창과 + 버튼 추가 */}
      <div className="search-add">
        <input type="text" className="search-input" placeholder="검색" />
        <button className="add-button">+</button>
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

          <h2>학점</h2>
          <input type="range" min="0" max="8" />

          <label>
            <input type="checkbox" /> 마감 기록 확인
          </label>

          <button className="search-button">검색</button>
        </aside>

        <main className="scholarship-list">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="scholarship-item" key={item}>
              <img src="#" alt="장학금 이미지" />
              <div>
                <h3>장학금 이름 {item}</h3>
                <p>장학금 혜택</p>
                <p>제공 기관</p>
                <span>D-day: 신청 기간</span>
              </div>
              <button className="favorite-star">★</button>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default App;
