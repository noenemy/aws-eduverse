/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createChimeMeeting = /* GraphQL */ `
  query CreateChimeMeeting($title: String, $name: String, $region: String) {
    createChimeMeeting(title: $title, name: $name, region: $region) {
      statusCode
      headers
      body
      isBase64Encoded
    }
  }
`;
export const joinChimeMeeting = /* GraphQL */ `
  query JoinChimeMeeting($meetingId: String, $name: String) {
    joinChimeMeeting(meetingId: $meetingId, name: $name) {
      statusCode
      headers
      body
      isBase64Encoded
    }
  }
`;
export const endChimeMeeting = /* GraphQL */ `
  query EndChimeMeeting($meetingId: String) {
    endChimeMeeting(meetingId: $meetingId) {
      statusCode
      headers
      body
      isBase64Encoded
    }
  }
`;
export const leaveChimeMeeting = /* GraphQL */ `
  query LeaveChimeMeeting($meetingId: String, $attendeeId: String) {
    leaveChimeMeeting(meetingId: $meetingId, attendeeId: $attendeeId) {
      statusCode
      headers
      body
      isBase64Encoded
    }
  }
`;
export const getTutee = /* GraphQL */ `
  query GetTutee($id: ID!) {
    getTutee(id: $id) {
      id
      nickname
      x
      y
      to
      state
      character
      ttl
      createdAt
      updatedAt
    }
  }
`;
export const listTutees = /* GraphQL */ `
  query ListTutees(
    $filter: ModelTuteeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTutees(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nickname
        x
        y
        to
        state
        character
        ttl
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAuditorium = /* GraphQL */ `
  query GetAuditorium($id: ID!) {
    getAuditorium(id: $id) {
      id
      title
      description
      image
      url
      createdAt
      updatedAt
    }
  }
`;
export const listAuditoriums = /* GraphQL */ `
  query ListAuditoriums(
    $filter: ModelAuditoriumFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAuditoriums(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        image
        url
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getClassroom = /* GraphQL */ `
  query GetClassroom($id: ID!) {
    getClassroom(id: $id) {
      id
      title
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const listClassrooms = /* GraphQL */ `
  query ListClassrooms(
    $filter: ModelClassroomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassrooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        image
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCourse = /* GraphQL */ `
  query GetCourse($id: ID!) {
    getCourse(id: $id) {
      id
      title
      icon
      tutor_voice
      tutor_character
      tutor_gender
      language
      order
      createdAt
      updatedAt
    }
  }
`;
export const listCourses = /* GraphQL */ `
  query ListCourses(
    $filter: ModelCourseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCourses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        icon
        tutor_voice
        tutor_character
        tutor_gender
        language
        order
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getLecture = /* GraphQL */ `
  query GetLecture($id: ID!) {
    getLecture(id: $id) {
      id
      course_ref
      title
      order
      createdAt
      updatedAt
    }
  }
`;
export const listLectures = /* GraphQL */ `
  query ListLectures(
    $filter: ModelLectureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLectures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        course_ref
        title
        order
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMeeting = /* GraphQL */ `
  query GetMeeting($title: String!) {
    getMeeting(title: $title) {
      meetingId
      title
      data
      createdAt
      updatedAt
    }
  }
`;
export const listMeetings = /* GraphQL */ `
  query ListMeetings(
    $title: String
    $filter: ModelMeetingFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listMeetings(
      title: $title
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        meetingId
        title
        data
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAttendee = /* GraphQL */ `
  query GetAttendee($attendeeId: String!) {
    getAttendee(attendeeId: $attendeeId) {
      attendeeId
      meetingId
      name
      createdAt
      updatedAt
    }
  }
`;
export const listAttendees = /* GraphQL */ `
  query ListAttendees(
    $attendeeId: String
    $filter: ModelAttendeeFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listAttendees(
      attendeeId: $attendeeId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        attendeeId
        meetingId
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
