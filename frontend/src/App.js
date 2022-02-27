import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useEffect } from "react";
import Amplify, { API } from 'aws-amplify';
import awsconfig from './aws-exports'
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuditoriumList from './components/auditorium/AuditoriumList';
import Auditorium from './components/auditorium/Auditorium';
import ClassroomList from './components/classroom/ClassroomList';
import Lounge from './components/lounge/Lounge';
import LoungeList from './components/lounge/LoungeList';
import VRLearning from './components/vrlearning/VRLearning';
import VRClassroom from './components/vrlearning/VRClassroom';
import About from './components/about/About';
import HomeComponent from './components/home/HomeComponent';

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import ChimeClassroom from './components/classroom/ChimeClassroom';
import { Box } from '@awsui/components-react';

Amplify.configure(awsconfig);

function App() {
  const showContentOnly = window.location.pathname === "/sumerian";

  // useEffect(()=>{
  //   API.get("vrlearning","/demo/polly/languages").then(res=>{
  //     console.log("@ /demo/polly/languages res > ", res)
  //   });

  //   API.get("vrlearning","/demo/polly/voices", {
  //     queryStringParameters: {
  //       languageCode: 'en-US'
  //     }
  //   }).then(res=>{
  //     console.log("@ /demo/polly/voices res > ", res)
  //   });

  //   API.get("vrlearning","/admin/health_check").then(res=>{
  //     console.log("@ /demo/polly/voices res > ", res)
  //   });
  // }, []);
  return (

      <BrowserRouter>
          { showContentOnly ? null :
            (<Navbar title="AWS Eduverse" />)
          }
          <Box margin={{top:"xxl"}} padding={{ top: "l" }}>
            <Routes>
              <Route path="/auditorium" element={<AuditoriumList />} />
              <Route path="/auditorium/:id" element={<Auditorium />} />         
              <Route path="/classroom" element={<ClassroomList />} />
              <Route path="/classroom/:id" element={<ChimeClassroom />} />
              <Route path="/vrlearning" element={<VRLearning />} />
              <Route path="/vrlearning/classroom" element={<VRClassroom />} />
              <Route path="/lounge" element={<LoungeList />} />
              <Route path="/lounge/:id" element={<Lounge />} />
              <Route path="/about" element={<About />} />
              <Route path="/" element={<HomeComponent />} />
            </Routes>
          </Box>
          { showContentOnly ? null : (<Footer />) }

        </BrowserRouter>
  );
}

export default App;
