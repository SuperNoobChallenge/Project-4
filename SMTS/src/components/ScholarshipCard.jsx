import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ScholarshipCard.css";

function ScholarshipCard({ item }) {
  const navigate = useNavigate();

  return (
    <div
      className="scholarship-item club-card"
      onClick={() => navigate(`/detail/${item.id}`)}
      style={{ cursor: "pointer" }}
    >
      <img src={item.imageUrl} alt="장학금 이미지" className="scholarship-image" />
      <div className="info-container">
        <h3 className="scholarship-name">{item.name}</h3>
        <p className="scholarship-provider">제공 기관: {item.provider}</p>
        <p className="scholarship-deadline">마감일: {item.deadline}</p>
        <p className="scholarship-benefit">장학금 혜택: {item.benefit}</p>
      </div>
      <button className="favorite-star">★</button>
    </div>
  );
}

export default ScholarshipCard; 