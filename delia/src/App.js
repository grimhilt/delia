import "./App.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { default as SignUp } from "./components/structures/auth/SignUp";
import { default as Login } from "./components/structures/auth/Login";

import { default as Home } from "./components/structures/global/Home";
import { default as Header } from "./components/structures/global/Header";

import { UserProvider } from "./contexts/UserContext";
import { default as RequireAuth } from "./utils/RequireAuth";
import Anecdote from "./components/structures/anecdote/Anecdote";

function App() {

  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Header />

          <Routes>
            <Route exact path="/login" element={ <Login/> } />
            <Route exact path="/signup" element={ <SignUp/> } />
            <Route exact path="/" element={ <Home/> } />

            <Route
              path="/anecdote/:id/:panel?"
              element={
                <RequireAuth>
                  <Anecdote />
                </RequireAuth>
              }
            />

          </Routes>
        </BrowserRouter>
      </UserProvider>
    </> 
  );
}

export default App;
