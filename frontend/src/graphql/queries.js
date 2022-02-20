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
export const searchCourses = /* GraphQL */ `
  query SearchCourses(
    $filter: SearchableCourseFilterInput
    $sort: [SearchableCourseSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableCourseAggregationInput]
  ) {
    searchCourses(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        title
        icon
        language
        order
        createdAt
        updatedAt
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const searchLectures = /* GraphQL */ `
  query SearchLectures(
    $filter: SearchableLectureFilterInput
    $sort: [SearchableLectureSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableLectureAggregationInput]
  ) {
    searchLectures(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        course_ref
        title
        order
        createdAt
        updatedAt
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const searchUnits = /* GraphQL */ `
  query SearchUnits(
    $filter: SearchableUnitFilterInput
    $sort: [SearchableUnitSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableUnitAggregationInput]
  ) {
    searchUnits(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        lecture_ref
        title
        steps
        order
        createdAt
        updatedAt
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
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
export const getUnit = /* GraphQL */ `
  query GetUnit($id: ID!) {
    getUnit(id: $id) {
      id
      lecture_ref
      title
      steps
      order
      createdAt
      updatedAt
    }
  }
`;
export const listUnits = /* GraphQL */ `
  query ListUnits(
    $filter: ModelUnitFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUnits(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        lecture_ref
        title
        steps
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
