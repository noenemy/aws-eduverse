import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from "react";
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomeComponent from './components/home/HomeComponent';
import AuditoriumComponent from './components/auditorium/AuditoriumComponent';
import ClassroomComponent from './components/classroom/ClassroomComponent';
import LoungeComponent from './components/lounge/LoungeComponent';
import VRLearningComponent from './components/vrlearning/VRLearningComponent';
import AboutComponent from './components/about/AboutComponent';

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

function App() {
  const showContentOnly = window.location.pathname === "/sumerian";
  return (
      <BrowserRouter>
          { showContentOnly ? null :
            (<Navbar title="AWS Eduverse" />)
          }

          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/auditorium" element={<Auditorium />} />            
            <Route path="/classroom" element={<Classroom />} />
            <Route path="/vrlearning" element={<VRLearning />} />
            <Route path="/lounge" element={<Lounge />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Home />} />
          </Routes>

          { showContentOnly ? null : (<Footer />) }

        </BrowserRouter>
  );
}

function Home(){
  return(
    <HomeComponent />
  )
}

function Auditorium(){
  return(
    <AuditoriumComponent />
  )
}

function Classroom(){
  return(
    <ClassroomComponent />
  )
}

function VRLearning(){
  return(
    <VRLearningComponent />
  )
}

function Lounge(){
  return(
      <LoungeComponent />
  )
}

function About(){
  return(
      <AboutComponent />
  )
}

export default App;
