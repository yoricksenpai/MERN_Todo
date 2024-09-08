import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext, useUser } from "../../contexts/UserContext";
import { register, login } from "../../api/auth";

function LoginAndRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { setUserInfo } = useUser();

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    try {
      if (isLogin) {
        const userInfo = await login(username, password);
        setUserInfo(userInfo);
        navigate("/");
      } else {
        await register(username, email, password);
        alert("Registration successful");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  }


  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lime-600 sm:text-sm sm:leading-6"
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
              />
            </div>
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lime-600 sm:text-sm sm:leading-6"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                />
              </div>
            </div>
          )}
          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lime-600 sm:text-sm sm:leading-6"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-lime-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600"
            >
              {isLogin ? "Sign in" : "Sign up"}
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm text-gray-500">
          {isLogin ? "Not yet registered?" : "Already have an account?"}{" "}
          <button
            className="font-semibold leading-6 text-lime-600 hover:text-lime-500"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginAndRegister;