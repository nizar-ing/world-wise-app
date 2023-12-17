import {useEffect, useState} from "react";

import {Button} from "../components/Button.jsx";
import {useAuth} from "../contexts/FakeAuthContext.jsx";
import PageNav from "../components/PageNav.jsx";

import styles from "./Login.module.css";
import {useNavigate} from "react-router-dom";
export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("nizar@example.com");
  const [password, setPassword] = useState("qwerty");
  const {login, isAuthenticated} = useAuth();

  const navigate = useNavigate();

  function handleSubmit(e){
    e.preventDefault();
    if(email && password) login(email, password);
  }

  useEffect(() => {
      if(isAuthenticated) navigate('/app', {replace: true});
  }, [isAuthenticated]);
  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type='primary'>Login</Button>
        </div>
      </form>
    </main>
  );
}
