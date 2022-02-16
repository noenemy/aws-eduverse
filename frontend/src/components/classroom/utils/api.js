// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { API, graphqlOperation } from 'aws-amplify';
import { createAttendeeGraphQL, createMeetingGraphQL, deleteMeetingGraphQL } from '../../../graphql/mutations';
import { createChimeMeeting, getAttendee, endChimeMeeting, getMeeting, joinChimeMeeting } from '../../../graphql/queries';


export async function createMeeting(title, attendeeName, region) {
  const joinInfo = await API.graphql(graphqlOperation(createChimeMeeting, {title: title, name: attendeeName, region: region }));
  const joinInfoJson = joinInfo.data.createChimeMeeting;
  const joinInfoJsonParse = JSON.parse(joinInfoJson.body);
  return joinInfoJsonParse;
}

export async function joinMeeting(meetingId, name) {
  const joinInfo = await API.graphql(graphqlOperation(joinChimeMeeting, {meetingId: meetingId, name: name}));
  const joinInfoJson = joinInfo.data.joinChimeMeeting;
  const joinInfoJsonParse = JSON.parse(joinInfoJson.body);
  return joinInfoJsonParse;
}

export async function endMeeting(meetingId) {
  const endInfo = await API.graphql(graphqlOperation(endChimeMeeting, {meetingId: meetingId}));
  const endInfoJson = endInfo.data.endChimeMeeting;
  await API.graphql(graphqlOperation(deleteMeetingGraphQL, {input: {title: meetingId}}));
  return endInfoJson;
}

export async function addMeetingToDB(title, meetingId, meetingData) {
  await API.graphql(graphqlOperation(createMeetingGraphQL, {input: {title: title, meetingId: meetingId, data: meetingData, }}));
}

export async function addAttendeeToDB(attendeeID, attendeeName) {
  await API.graphql(graphqlOperation(createAttendeeGraphQL, {input: {attendeeId: attendeeID, name: attendeeName }}));
}

export async function getMeetingFromDB(title) {
  const meetingInfo = await API.graphql(graphqlOperation(getMeeting, {title: title }));
  return meetingInfo;
}

export async function getAttendeeFromDB(attendeeId) {
  const attendeeInfo = await API.graphql(graphqlOperation(getAttendee, {attendeeId: attendeeId }));
  return attendeeInfo;
}