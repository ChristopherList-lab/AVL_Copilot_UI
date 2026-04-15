import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthContext, useAuthState } from './lib/auth';
import { RedirectIfAuthed, RequireAuth } from './components/RequireAuth';
import { SignIn } from './routes/SignIn';
import { SignUp } from './routes/SignUp';
import { ForgotPassword } from './routes/ForgotPassword';
import { Chat } from './routes/Chat';
import { Settings } from './routes/Settings';

function App() {
  const auth = useAuthState();
  return (
    <AuthContext.Provider value={auth}>
      <HashRouter>
        <button
          type="button"
          className="skip-link"
          onClick={() => {
            const el = document.getElementById('main');
            if (el) {
              el.setAttribute('tabindex', '-1');
              (el as HTMLElement).focus();
            }
          }}
        >
          Skip to content
        </button>
        <Routes>
          <Route
            path="/signin"
            element={
              <RedirectIfAuthed>
                <SignIn />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectIfAuthed>
                <SignUp />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/forgot"
            element={
              <RedirectIfAuthed>
                <ForgotPassword />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Chat />
              </RequireAuth>
            }
          />
          <Route
            path="/thread/:id"
            element={
              <RequireAuth>
                <Chat />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}

export default App;
