import React, { useState } from "react";
import { db } from "../firebase"; // Firebase 설정 파일에서 db를 가져옵니다.
import { collection, addDoc } from "firebase/firestore";

function AddPage() {
  const [name, setName] = useState("");
  const [benefit, setBenefit] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "scholarships"), {
        name,
        benefit,
      });
      alert("데이터가 추가되었습니다!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <h2>장학금 추가</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="장학금 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="장학금 혜택"
          value={benefit}
          onChange={(e) => setBenefit(e.target.value)}
        />
        <button type="submit">추가</button>
      </form>
    </div>
  );
}

export default AddPage;
