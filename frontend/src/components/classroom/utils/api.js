// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { API, graphqlOperation } from 'aws-amplify';
import { createAttendeeGraphQL, createMeetingGraphQL, deleteMeetingGraphQL, deleteAttendeeGraphQL } from '../../../graphql/mutations';
import { createChimeMeeting, getAttendee, endChimeMeeting, getMeeting, joinChimeMeeting, listAttendees, leaveChimeMeeting } from '../../../graphql/queries';


export async function createMeeting(title, attendeeName, region) {
  const joinInfo = await API.graphql(graphqlOperation(createChimeMeeting, {title: title, name: attendeeName, region: region}));
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

export async function endMeeting(meetingId, title, attendeeId) {
  const endInfo = await API.graphql(graphqlOperation(endChimeMeeting, {meetingId: meetingId}));
  const endInfoJson = endInfo.data.endChimeMeeting;
  await API.graphql(graphqlOperation(deleteMeetingGraphQL, {input: {title: title}}));
  await API.graphql(graphqlOperation(deleteAttendeeGraphQL, {input: {attendeeId: attendeeId}}));
  return endInfoJson;
}

export async function deleteMeeting(title) {
  const deleteInfo = await API.graphql(graphqlOperation(deleteMeetingGraphQL, {input: {title: title}}));
  return deleteInfo;
}

export async function leaveMeeting(meetingId, attendeeId) {
  const leaveInfo = await API.graphql(graphqlOperation(leaveChimeMeeting, {meetingId: meetingId, attendeeId: attendeeId}));
  const leaveInfoJson = leaveInfo.data.leaveMeeting;
  await API.graphql(graphqlOperation(deleteAttendeeGraphQL, {input: {attendeeId: attendeeId}}));
  return leaveInfo;
}

export async function addMeetingToDB(meetingId, title, meetingData) {
  await API.graphql(graphqlOperation(createMeetingGraphQL, {input: {meetingId: meetingId, title: title, data: meetingData}}));
}

export async function addAttendeeToDB(attendeeId, meetingId, attendeeName) {
  await API.graphql(graphqlOperation(createAttendeeGraphQL, {input: {attendeeId: attendeeId, meetingId: meetingId, name: attendeeName}}));
}

export async function getMeetingFromDB(title) {
  const meetingInfo = await API.graphql(graphqlOperation(getMeeting, {title: title}));
  return meetingInfo;
}

export async function getAttendeeFromDB(meetingId) {
  const attendeeInfo = await API.graphql(graphqlOperation(getAttendee, {meetingId: meetingId}));
  return attendeeInfo;
}

export async function getAttendees(meetingId) {
  const attendeeInfo = await API.graphql(graphqlOperation(listAttendees, {meetingId: meetingId}));
  return attendeeInfo;
}
