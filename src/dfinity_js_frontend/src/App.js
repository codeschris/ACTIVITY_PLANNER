import React, { useEffect, useCallback, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import "./App.css";
import Wallet from "./components/Wallet";
import coverImg from "./assets/img/Plan.jpg";
import { login, logout as destroy } from "./utils/auth";
import Cover from "./components/utils/Cover";
import { Notification } from "./components/utils/Notifications";
import Home from "./home/Home";


const App = function AppWrapper() {
  const isAuthenticated = window.auth.isAuthenticated;
  
  return (
    <>
    <Notification />
      {isAuthenticated ? (
        <Container fluid="md">
          <main>
           <Home />
          </main>
        </Container>
      ) : (
        <Cover name="Activity Planner" login={login} coverImg={coverImg} />
      )}
    </>
  );
};

export default App;
