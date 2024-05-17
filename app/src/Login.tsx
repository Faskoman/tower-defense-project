import axios from "axios";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SHA256 } from "crypto-js";
import "./Register.scss";
import { AuthPageBackgroundBees } from "./AuthPageBackgroundBees";

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const loginUser = {
      userName: formData.get("userName")!.toString(),
      hashedPassword: SHA256(formData.get("password")!.toString()).toString(),
    };

    try {
      await axios.post("http://localhost:3000/users/login", loginUser);

      const token = {
        secret: "SUPERSECRET",
        userName: loginUser.userName,
      };

      sessionStorage.setItem("token", JSON.stringify(token));

      navigate("/");
    } catch (err) {
      setError(`Invalid username or password.`);
    }
  };

  return (
    <div className="register__background">
      <AuthPageBackgroundBees />
      <div className="register-container">
        <form className="registerForm" onSubmit={handleSubmit}>
          <h1 className="registerForm__title">Login</h1>
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
            <Link to={`/register`} className="registerForm__switch-form">
              Don't have a user? sign up
            </Link>
            <Link to={`/`}>Continue as Guest</Link>
          </div>
          <button className="registerForm__button">Continue</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
