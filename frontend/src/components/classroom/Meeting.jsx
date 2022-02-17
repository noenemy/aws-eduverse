// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  AudioInputControl,
  AudioOutputControl,
  ContentShareControl,
  ControlBar,
  ControlBarButton,
  Phone,
  useMeetingManager,
  MeetingStatus,
  useMeetingStatus,
  VideoInputControl,
  VideoTileGrid
} from 'amazon-chime-sdk-component-library-react';
import { 
  addAttendeeToDB,
  addMeetingToDB,
  createMeeting,
  // getAttendeeFromDB,
  getMeetingFromDB,
  joinMeeting,
  endMeeting
 } from './utils/api';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/user/userState';

const Meeting = (props) => {
  const meetingManager = useMeetingManager();
  const meetingStatus = useMeetingStatus();
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const title = pathname.split('/')[2];

  const user = useRecoilValue(userState);

  useEffect(() => {

    if(!user || !user.nickname) {
      navigate('/');
    }
    
    createAndJoinMeeting();

    return async () => {
      const meetingId = meetingManager.meetingId;
      if (meetingId) {
        // await endMeeting(meetingId, title);
        await meetingManager.leave();
      }
    }

  }, []);

  const createAndJoinMeeting = async () => {
    // Generate random username
    const name = user.nickname; // Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 4);

    const meetingResponse = await getMeetingFromDB(title);
    const meetingJson = meetingResponse.data.getMeeting;
    try {
      if (meetingJson) {
        const meetingData = JSON.parse(meetingJson.data);
        const joinInfo = await joinMeeting(meetingData.MeetingId, name);
        await addAttendeeToDB(joinInfo.Attendee.AttendeeId, name);

        await meetingManager.join({
          meetingInfo: meetingData,
          attendeeInfo: joinInfo.Attendee
        });
      } else {
        const joinInfo = await createMeeting(title, name, 'us-east-1');
        await addMeetingToDB(title, joinInfo.Meeting.MeetingId, JSON.stringify(joinInfo.Meeting));
        await addAttendeeToDB(joinInfo.Attendee.AttendeeId, name);

        await meetingManager.join({
          meetingInfo: joinInfo.Meeting,
          attendeeInfo: joinInfo.Attendee
        });
      }
    } catch (error) {
      console.log(error);
    }

    await meetingManager.start();
  }

  const clickedEndMeeting = async () => {
    const meetingId = meetingManager.meetingId;
    if (meetingId) {
      await endMeeting(meetingId, title);
      await meetingManager.leave();
      navigate(`/classroom/`);
    }
  }
  
  return (
      <div style={{marginTop: '2rem', height: '40rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <VideoTileGrid/>
        {meetingStatus === MeetingStatus.Succeeded ?
          <ControlBar
            layout="undocked-horizontal"
            showLabels
          >
            <AudioInputControl />
            <VideoInputControl />
            <AudioOutputControl />
            <ContentShareControl />
            <ControlBarButton icon={<Phone />} onClick={clickedEndMeeting} label="End" />
          </ControlBar> 
          :
          <div/>
        }
      </div>
  );
};

export default Meeting;
