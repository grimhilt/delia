import "./App.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { default as SignUp } from "./components/views/auth/SignUp";
import { default as SignIn } from "./components/views/auth/SignIn";

import { default as Home } from "./components/views/global/Home";
import { default as Header } from "./components/views/global/Header";

import { UserProvider } from "./contexts/UserContext";

function App() {

  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Header />

          <Routes>
            <Route exact path="/signin" element={ <SignIn/> } />
            <Route exact path="/signup" element={ <SignUp/> } />
            <Route exact path="/" element={ <Home/> } />

            {/* <PrivateRoute exact path="/geschenkt/:id" component={Geschenkt} /> */}
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;
