import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/ScholarshipCard.css";

function ScholarshipCard({ item }) {
  const navigate = useNavigate();
  const auth = getAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  // 컴포넌트 마운트 시 즐겨찾기 상태 확인
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const favorites = userDoc.data().favorites || [];
          setIsFavorite(favorites.includes(item.id));
        }
      }
    };

    checkFavoriteStatus();
  }, [item.id, auth]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    
    const user = auth.currentUser;
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      
      if (isFavorite) {
        // 즐겨찾기 해제
        await updateDoc(userDocRef, {
          favorites: arrayRemove(item.id)
        });
      } else {
        // 즐겨찾기 추가
        await updateDoc(userDocRef, {
          favorites: arrayUnion(item.id)
        });
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("즐겨찾기 오류:", error);
    }
  };

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
      <button 
        className={`favorite-star ${isFavorite ? 'active' : ''}`} 
        onClick={handleFavoriteClick}
      >
        {isFavorite ? '★' : '☆'}
      </button>
    </div>
  );
}

export default ScholarshipCard; 