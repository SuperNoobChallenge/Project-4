// SMTS/src/UserPages/LoginPage.jsx

import React, { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 로직을 여기에 추가하세요
    console.log("Email:", email);
    console.log("Password:", password);
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
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password</label>
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
          Sign In
        </button>
      </form>
      <a
        href="#"
        onClick={handleForgotPassword}
        style={{ display: "block", marginTop: "10px", textAlign: "center" }}
      >
        Forgot password?
      </a>
    </div>
  );
}

export default LoginPage;
