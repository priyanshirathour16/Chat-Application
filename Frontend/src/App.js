import React from "react";
import { Routes, Route } from "react-router-dom";
import Chat from "./Pages/Chat";
import Signup from "./Components/Auth/Signup";
import Login from "./Components/Auth/Login";
import Error from "./Components/Error/Error";
import "./App.css";
import ChatProvider from "./Context/ChatProvider";

const App = () => {
  return (
    <div className="App">
      <ChatProvider>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/" element={<Signup />} />

          <Route exact path="/chats" element={<Chat />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </ChatProvider>
    </div>
  );
};

export default App;
