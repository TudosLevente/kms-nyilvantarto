import { useState } from "react";
import { BrandMark } from "../components/ui/BrandMark.jsx";

export function LoginPage({ onLogin, error, setError }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onLogin({ username, password });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-screen">
      <section className="login-panel" aria-labelledby="loginTitle">
        <BrandMark />
        <h1 id="loginTitle">KMS Dojo</h1>
        <p>Tanítványok, csoportok és befizetések fegyelmezett nyilvántartása.</p>
        <form className="login-form" onSubmit={submit}>
          <label>
            Felhasználónév
            <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
          </label>
          <label>
            Jelszó
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required />
          </label>
          <p className="error-text" aria-live="polite">{error}</p>
          <button className="primary-button" type="submit" disabled={busy}>{busy ? "Belépés..." : "Belépés"}</button>
        </form>
      </section>
    </main>
  );
}
