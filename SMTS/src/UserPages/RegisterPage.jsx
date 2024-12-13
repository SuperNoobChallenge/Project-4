import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterPage.css";

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    // 비밀번호 길이 확인
    if (formData.password.length < 6) {
      alert("비밀번호는 최소 6자 이상이어야 합니다.");
      return; // 비밀번호가 짧으면 함수 종료
    }

    // 이메일 형식 확인
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      alert("유효한 이메일 주소를 입력해 주세요.");
      return; // 유효하지 않은 이메일 형식이면 함수 종료
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // users 컬렉션에 문서 생성 (favorites 배열 초기화)
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        favorites: []
      });
      
      console.log("User registered:", user);
      navigate("/"); // 회원가입 성공 후 메인 페이지로 리디렉션
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.code === "auth/email-already-in-use") {
        alert("이 이메일 주소는 이미 사용 중입니다. 다른 이메일을 사용해 주세요.");
      } else if (error.code === "auth/invalid-email") {
        alert("유효하지 않은 이메일 주소입니다. 다시 확인해 주세요.");
      } else {
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요."); // 일반 오류 메시지
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
