import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "../styles/DetailPage.css";

const DetailPage = () => {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState(null);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const docRef = doc(db, "scholarships", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setScholarship(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchScholarship();
  }, [id]);

  if (!scholarship) {
    return <div>Loading...</div>;
  }

  return (
    <div className="detail-page">
      <div className="image-container">
        <img
          src={scholarship.imageUrl}
          alt="장학금 이미지"
          className="scholarship-image"
        />
      </div>
      <div className="info-container">
        <h2>{scholarship.name}</h2>
        <ul>
          <li>D day: {scholarship.deadline}</li>
          <li>제공 기관: {scholarship.provider}</li>
          <li>장학금 유형: {scholarship.type}</li>
          <li>지원 자격 요건: {scholarship.eligibility}</li>
          <li>장학금 혜택: {scholarship.benefit}</li>
          <li>신청 기간: {scholarship.applicationPeriod}</li>
          <li>지원 절차: {scholarship.procedure}</li>
          <li>신청 방법: {scholarship.method}</li>
          <li>필요 서류: {scholarship.documents}</li>
          <li>담당자 연락처: {scholarship.contact}</li>
          <li>소득분위: {scholarship.incomeLevel}</li>
          <li>
            사이트 주소:{" "}
            <a
              href={scholarship.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              {scholarship.website}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DetailPage;
