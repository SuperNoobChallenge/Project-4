import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "../styles/AddPage.css";

function AddPage() {
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [provider, setProvider] = useState("");
  const [type, setType] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [benefit, setBenefit] = useState("");
  const [applicationPeriod, setApplicationPeriod] = useState("");
  const [procedure, setProcedure] = useState("");
  const [method, setMethod] = useState("");
  const [documents, setDocuments] = useState("");
  const [contact, setContact] = useState("");
  const [incomeLevel, setIncomeLevel] = useState(1);
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [educationLevel, setEducationLevel] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "scholarships"), {
        name,
        deadline,
        imageUrl,
        provider,
        type,
        eligibility,
        benefit,
        applicationPeriod,
        procedure,
        method,
        documents,
        contact,
        incomeLevel: Number(incomeLevel), // 숫자로 변환해주면 좋음
        website,
        location,
        educationLevel,
        createdAt: serverTimestamp(), // 현재 서버 시간 기록
      });
      alert("데이터가 추가되었습니다!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="add-page-container">
      <h2>장학금 추가</h2>
      <form onSubmit={handleSubmit} className="add-page-form">
        <input
          type="text"
          placeholder="장학금 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="date"
          placeholder="마감일"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <input
          type="text"
          placeholder="장학금 이미지 주소"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="제공 기관"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        />
        <input
          type="text"
          placeholder="장학금 유형"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <input
          type="text"
          placeholder="지원 자격 요건"
          value={eligibility}
          onChange={(e) => setEligibility(e.target.value)}
        />
        <input
          type="text"
          placeholder="장학금 혜택"
          value={benefit}
          onChange={(e) => setBenefit(e.target.value)}
        />
        <input
          type="text"
          placeholder="지원 절차"
          value={procedure}
          onChange={(e) => setProcedure(e.target.value)}
        />
        <input
          type="text"
          placeholder="신청 방법"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />
        <input
          type="text"
          placeholder="필요 서류"
          value={documents}
          onChange={(e) => setDocuments(e.target.value)}
        />
        <input
          type="text"
          placeholder="담당자 연락처"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <label>
          소득분위: 1 ~ {incomeLevel}
          <input
            type="range"
            min="1"
            max="10"
            value={incomeLevel}
            onChange={(e) => setIncomeLevel(e.target.value)}
          />
        </label>
        <input
          type="url"
          placeholder="사이트 주소"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <input
          type="text"
          placeholder="지역"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="학력"
          value={educationLevel}
          onChange={(e) => setEducationLevel(e.target.value)}
        />
        <button type="submit">추가</button>
      </form>
    </div>
  );
}

export default AddPage;
