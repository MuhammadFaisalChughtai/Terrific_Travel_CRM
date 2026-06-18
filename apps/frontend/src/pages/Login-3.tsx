import React from "react";
import { useState } from "react";
import { z } from "zod";

interface LoginState {
  email: string;
  password: string;
  errors: Record<string, string>;
  loading: boolean;
}
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Login() {
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  const [login, setLogin] = useState<LoginState>({
    email: "",
    password: "",
    errors: {},
    loading: false,
  });
  const { email, password, loading } = login;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLogin({ ...login, errors: {} });
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      console.log(result.error.errors);
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0].toString()] = err.message;
      });
      setLogin({ ...login, errors: fieldErrors });
      return;
    }
    setLogin({ ...login, loading: true });
  };

  return (
    <div className="">
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={login.email}
              name="email"
              onChange={onChange}
              className="text-black border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={login.password}
              name="password"
              onChange={onChange}
              className="text-black border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
