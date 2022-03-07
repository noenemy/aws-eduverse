// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AudioInputControl,
  ContentShareControl,
  ControlBar,
  ControlBarButton,
  Phone,
  useMeetingManager,
  MeetingStatus,
  useMeetingStatus,
  VideoInputBackgroundBlurControl,
  VideoTileGrid,
} from 'amazon-chime-sdk-component-library-react';
import { 
  addAttendeeToDB,
  addMeetingToDB,
  createMeeting,
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
        
        {meetingStatus === MeetingStatus.Succeeded ?
          <Fragment>
            <VideoTileGrid />
            <ControlBar
              layout="undocked-horizontal"
              showLabels
            >
              <AudioInputControl />
              <VideoInputBackgroundBlurControl />
              <ContentShareControl />
              <ControlBarButton icon={<Phone />} onClick={clickedEndMeeting} label="End" />
            </ControlBar>
          </Fragment>
          :
          <Fragment>
            <p className="h3 text-muted">강의실에 접속 중입니다. 잠시만 기다려 주세요.</p>
            <p>&nbsp;</p>
            <p className="h5 text-muted">웹캠과 마이크를 사용해서 다른 참여자와 대화할 수 있습니다.</p>
            <p>&nbsp;</p>
            <ReactLoading type="spin" color="#123abc" />
          </Fragment>
        }
      </div>
  );
};

export default Meeting;
