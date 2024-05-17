import axios from "axios";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SHA256 } from "crypto-js";
import { AuthPageBackgroundBees } from "./Components/AuthPageBackgroundBees";
import "./styles/Register.scss";
import { server } from "./router";

function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    let userName = formData.get("userName")!.toString();
    userName = userName.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const registerUser = {
      id: crypto.randomUUID(),
      userName,
      hashedPassword: SHA256(formData.get("password")!.toString()).toString(),
    };

    try {
      await server.post("/users/register", registerUser);

      const token = {
        secret: "SUPERSECRET",
        userName: registerUser.userName,
      };

      sessionStorage.setItem("token", JSON.stringify(token));

      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError("Username already taken, please choose different one.");
      } else {
        console.error(err);
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div className="register__background">
      <AuthPageBackgroundBees />
      <div className="register-container">
        <form className="registerForm" onSubmit={handleSubmit}>
          <h1 className="registerForm__title">Register</h1>
          <div className="registerForm__field">
            <label htmlFor="userName">Username: </label>
            <input type="text" name="userName" id="userName" required />
          </div>
          <div className="registerForm__field">
            <label htmlFor="password">Password: </label>
            <input type="password" name="password" id="password" required />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="registerForm__links">
            <Link to={`/login`}>Already registered? Sign in</Link>
            <Link to={`/`}>Continue as Guest</Link>
          </div>
          <button className="registerForm__button">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
