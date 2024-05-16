import axios from "axios";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

const server = axios.create({
  baseURL: "",
});

const hasUser = true;

function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const user = {
      userName: formData.get("userName")!.toString(),
      email: formData.get("email")!.toString(),
    };

    const registerUser = {
      id: crypto.randomUUID(),
      userName: formData.get("userName")!.toString(),
      email: formData.get("email")!.toString(),
    };

    try {
      await server.post("/register", registerUser);
    } catch (err) {
      console.error(err);
    }

    try {
      const res = await axios.post("http://localhost:3000/login", { user });

      localStorage.setItem("token", res.data);

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login__background">
      <div className="login-container">
        <form className="loginForm" onSubmit={handleSubmit}>
          <h1 className="loginForm__title">{hasUser ? "Login" : "Register"}</h1>
          <div className="loginForm__field">
            <label htmlFor="userName">Username: </label>
            <input type="text" name="userName" id="userName" required />
          </div>
          <div className="loginForm__field">
            <label htmlFor="email">Email: </label>
            <input type="email" name="email" id="email" required />
          </div>
          <button className="loginForm__button">
            {hasUser ? "Continue" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
