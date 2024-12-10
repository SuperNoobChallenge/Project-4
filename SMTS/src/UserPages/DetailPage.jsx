import React from "react";
import "./DetailPage.css";

const DetailPage = () => {
  return (
    <div className="detail-page">
      <div className="image-container">
        <img
          src="your-image-url"
          alt="장학금 이미지"
          className="scholarship-image"
        />
      </div>
      <div className="info-container">
        <h2>장학금 이름</h2>
        <p>D day</p>
        <ul>
          <li>제공 기관</li>
          <li>장학금 유형</li>
          <li>지원 자격 요건</li>
          <li>장학금 혜택</li>
          <li>신청 기간</li>
          <li>지원 절차</li>
          <li>신청 방법</li>
          <li>필요 서류</li>
          <li>담당자 연락처</li>
        </ul>
      </div>
    </div>
  );
};

export default DetailPage;
