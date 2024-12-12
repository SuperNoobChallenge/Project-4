// SMTS/src/UserPages/LoginPage.jsx

import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    
    try {
      // 파이어베이스 이메일/비밀번호 로그인 시도
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("로그인 성공:", userCredential.user);
      // 로그인 성공 시 메인 페이지로 이동
      navigate("/");
    } catch (error) {
      // 로그인 실패 시 에러 메시지 표시
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      console.error("로그인 에러:", error);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(
      "우리 사이트는 계정 찾기 밎 비밀번호 변경을 지원하지 않습니다.\n다행이도 우리 사이트는 무차별 대입 공격에 대한 대비가 되어 있지 않으니 기억을 최대한 활용하여 보시길 바랍니다\n계정을 새로 생성하시는 거도 좋아 보이시는군요"
    );
  };

  return (
    <div
      style={{
        maxWidth: "300px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    >
      <h2>로그인</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          로그인
        </button>
      </form>
      <a
        href="#"
        onClick={handleForgotPassword}
        style={{ display: "block", marginTop: "10px", textAlign: "center" }}
      >
        비밀번호를 잊으셨나요?
      </a>
    </div>
  );
}

export default LoginPage;
