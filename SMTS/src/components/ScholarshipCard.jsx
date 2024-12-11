import React from "react";
import { useNavigate } from "react-router-dom";

function ScholarshipCard({ item }) {
  const navigate = useNavigate();

  return (
    <div
      className="scholarship-item club-card"
      onClick={() => navigate(`/detail/${item.id}`)}
      style={{ cursor: "pointer" }}
    >
      <img src="#" alt="장학금 이미지" />
      <div>
        <h3>{item.name}</h3>
        <p>{item.benefit}</p>
        <span>D-day: 신청 기간</span>
      </div>
      <button className="favorite-star">★</button>
    </div>
  );
}

export default ScholarshipCard; 