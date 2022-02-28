// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  VideoTileGrid,
} from 'amazon-chime-sdk-component-library-react';
import { 
  addAttendeeToDB,
  addMeetingToDB,
  createMeeting,
  // getAttendeeFromDB,
  getMeetingFromDB,
  joinMeeting,
  endMeeting,
  deleteMeeting,
  getAttendees,
  leaveMeeting
 } from './utils/api';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/user/userState';
import ReactLoading from 'react-loading';

const Meeting = (props) => {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(props.title);
  const meetingManager = useMeetingManager();
  const meetingStatus = useMeetingStatus();
  const navigate = useNavigate();

  const user = useRecoilValue(userState);

  useEffect(() => {

    if(!user || !user.nickname) {
      navigate('/');
    }
    setLoading(false);
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
    const name = user.nickname;

    const meetingResponse = await getMeetingFromDB(title);
    const meetingJson = meetingResponse.data.getMeeting;
    try {
      if (meetingJson) {
        const meetingData = JSON.parse(meetingJson.data);
        const joinInfo = await joinMeeting(meetingData.MeetingId, name);
        await addAttendeeToDB(joinInfo.Attendee.AttendeeId, meetingData.MeetingId, name);

        await meetingManager.join({
          meetingInfo: meetingData,
          attendeeInfo: joinInfo.Attendee
        });
      } else {
        const joinInfo = await createMeeting(title, name, 'us-east-1');
        await addMeetingToDB(joinInfo.Meeting.MeetingId, title, JSON.stringify(joinInfo.Meeting));
        await addAttendeeToDB(joinInfo.Attendee.AttendeeId, joinInfo.Meeting.MeetingId, name);

        await meetingManager.join({
          meetingInfo: joinInfo.Meeting,
          attendeeInfo: joinInfo.Attendee
        });
      }
    } catch (error) {
      console.log(error);
      await deleteMeeting(title);
      const joinInfo = await createMeeting(title, name, 'us-east-1');
      await addMeetingToDB(joinInfo.Meeting.MeetingId, title, JSON.stringify(joinInfo.Meeting));
      await addAttendeeToDB(joinInfo.Attendee.AttendeeId, joinInfo.Meeting.MeetingId, name);
      await meetingManager.join({
        meetingInfo: joinInfo.Meeting,
        attendeeInfo: joinInfo.Attendee
      });
    }

    await meetingManager.start();
  }

  const clickedEndMeeting = async () => {
    const meetingId = meetingManager.meetingId;
    const name = user.nickname;

    const attendeeResponse = await getAttendees(meetingId);
    const attendeeCount = attendeeResponse.data.listAttendees.items.length;
    const attendeeId = attendeeResponse.data.listAttendees.items.filter(e => e.name == name)[0].attendeeId;

    try {
      // if (attendeeCount == 1) {
        // await endMeeting(meetingId, title, attendeeId);
      // } else {
        await leaveMeeting(meetingId, attendeeId);
      // }
    } catch (error){
      console.log(error);
    }
    await meetingManager.leave();
    navigate(`/classroom/`);
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
          <><ReactLoading type="spin" color="#123abc" /><div /></>
        }
      </div>
  );
};

export default Meeting;
