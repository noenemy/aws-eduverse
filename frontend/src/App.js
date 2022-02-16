import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from "react";
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports'
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuditoriumList from './components/auditorium/AuditoriumList';
import Auditorium from './components/auditorium/Auditorium';
import Classroom from './components/classroom/Classroom';
import Lounge from './components/lounge/Lounge';
import VRLearning from './components/vrlearning/VRLearning';
import About from './components/about/About';
import HomeComponent from './components/home/HomeComponent';

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

Amplify.configure(awsconfig);

function App() {
  const showContentOnly = window.location.pathname === "/sumerian";
  return (

      <BrowserRouter>
          { showContentOnly ? null :
            (<Navbar title="AWS Eduverse" />)
          }

          <Routes>
            <Route path="/auditorium" element={<AuditoriumList />} />
            <Route path="/auditorium/:id" element={<Auditorium />} />         
            <Route path="/classroom" element={<Classroom />} />
            <Route path="/classroom/:classroomId" element={<Classroom />} />
            <Route path="/vrlearning" element={<VRLearning />} />
            <Route path="/lounge" element={<Lounge />} />
            <Route path="/lounge/:id" element={<Lounge />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<HomeComponent />} />
          </Routes>

          { showContentOnly ? null : (<Footer />) }

        </BrowserRouter>
  );
}

export default App;
