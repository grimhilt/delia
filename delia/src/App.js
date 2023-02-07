import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { default as SignUp } from "./components/structures/auth/SignUp";
import { default as Login } from "./components/structures/auth/Login";

import { default as Home } from "./components/structures/global/Home";
import { default as Header } from "./components/structures/global/Header";

import { UserProvider } from "./contexts/UserContext";
import { default as RequireAuth } from "./utils/RequireAuth";
import Anecdote from "./components/structures/anecdote/Anecdote";
import Editer from "./components/structures/anecdote/Editer";
import Answers from "./components/structures/anecdote/Answers";
import Results from "./components/structures/anecdote/Results";
import RoomInfos from "./components/structures/anecdote/RoomInfos";
import { AnecdoteProvider } from "./contexts/AnecdoteContext";


function App() {
    return (
        <>
            <UserProvider>
                <BrowserRouter>
                    <Header />

                    <Routes>
                        {/* AUTH */}
                        <Route exact path="/login" element={<Login />} />
                        <Route exact path="/signup" element={<SignUp />} />
                        <Route exact path="/" element={<Home />} />


                         {/* ANECDOTES */}
                        <Route
                            path="/anecdote/:id/editer?"
                            element={
                                <RequireAuth>
                                    <AnecdoteProvider>
                                        <Anecdote />
                                        <Editer />
                                    </AnecdoteProvider>
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/anecdote/:id/answers"
                            element={
                                <RequireAuth>
                                    <AnecdoteProvider>
                                        <Anecdote />
                                        <Answers />
                                    </AnecdoteProvider>
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/anecdote/:id/results"
                            element={
                                <RequireAuth>
                                    <AnecdoteProvider>
                                        <Anecdote />
                                        <Results />
                                    </AnecdoteProvider>
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/anecdote/:id/infos"
                            element={
                                <RequireAuth>
                                    <AnecdoteProvider>
                                        <Anecdote />
                                        <RoomInfos />
                                    </AnecdoteProvider>
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
