import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../styles/DetailPage.css";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const docRef = doc(db, "scholarships", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // 장학금 데이터 설정
          setScholarship(data);
          // 즐겨찾기 상태 확인
          await checkFavoriteStatus(data.id || id);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchScholarship();
  }, [id]);

  const checkFavoriteStatus = async (scholarshipId) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const favorites = userDoc.data().favorites || [];
        setIsFavorite(favorites.includes(scholarshipId));
      }
    }
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지

    const user = auth.currentUser;
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!scholarship || !scholarship.id) {
      console.error("장학금 정보가 유효하지 않습니다.");
      return; // scholarship가 없거나 id가 없으면 함수 종료
    }

    try {
      const userDocRef = doc(db, "users", user.uid);

      if (isFavorite) {
        // 즐겨찾기 해제
        await updateDoc(userDocRef, {
          favorites: arrayRemove(scholarship.id),
        });
      } else {
        // 즐겨찾기 추가
        await updateDoc(userDocRef, {
          favorites: arrayUnion(scholarship.id),
        });
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("즐겨찾기 오류:", error);
    }
  };

  if (!scholarship) {
    return <div>Loading...</div>;
  }

  return (
    <div className="detail-page">
      <div className="header">
        <h2>{scholarship.name}</h2>
        <button
          className={`favorite-star ${isFavorite ? "active" : ""}`}
          onClick={handleFavoriteClick}
          style={{ float: "right" }}
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>
      <div className="image-container">
        <img
          src={scholarship.imageUrl}
          alt="장학금 이미지"
          className="scholarship-image"
        />
      </div>
      <div className="info-container">
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
        <button onClick={() => navigate(-1)}>뒤로 가기</button>
      </div>
    </div>
  );
};

export default DetailPage;
