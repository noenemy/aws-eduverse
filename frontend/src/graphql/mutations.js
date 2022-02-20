/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTutee = /* GraphQL */ `
  mutation CreateTutee(
    $input: CreateTuteeInput!
    $condition: ModelTuteeConditionInput
  ) {
    createTutee(input: $input, condition: $condition) {
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
export const updateTutee = /* GraphQL */ `
  mutation UpdateTutee(
    $input: UpdateTuteeInput!
    $condition: ModelTuteeConditionInput
  ) {
    updateTutee(input: $input, condition: $condition) {
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
export const deleteTutee = /* GraphQL */ `
  mutation DeleteTutee(
    $input: DeleteTuteeInput!
    $condition: ModelTuteeConditionInput
  ) {
    deleteTutee(input: $input, condition: $condition) {
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
export const createAuditorium = /* GraphQL */ `
  mutation CreateAuditorium(
    $input: CreateAuditoriumInput!
    $condition: ModelAuditoriumConditionInput
  ) {
    createAuditorium(input: $input, condition: $condition) {
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
export const updateAuditorium = /* GraphQL */ `
  mutation UpdateAuditorium(
    $input: UpdateAuditoriumInput!
    $condition: ModelAuditoriumConditionInput
  ) {
    updateAuditorium(input: $input, condition: $condition) {
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
export const deleteAuditorium = /* GraphQL */ `
  mutation DeleteAuditorium(
    $input: DeleteAuditoriumInput!
    $condition: ModelAuditoriumConditionInput
  ) {
    deleteAuditorium(input: $input, condition: $condition) {
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
export const createClassroom = /* GraphQL */ `
  mutation CreateClassroom(
    $input: CreateClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    createClassroom(input: $input, condition: $condition) {
      id
      title
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const updateClassroom = /* GraphQL */ `
  mutation UpdateClassroom(
    $input: UpdateClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    updateClassroom(input: $input, condition: $condition) {
      id
      title
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const deleteClassroom = /* GraphQL */ `
  mutation DeleteClassroom(
    $input: DeleteClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    deleteClassroom(input: $input, condition: $condition) {
      id
      title
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const createCourse = /* GraphQL */ `
  mutation CreateCourse(
    $input: CreateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    createCourse(input: $input, condition: $condition) {
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
export const updateCourse = /* GraphQL */ `
  mutation UpdateCourse(
    $input: UpdateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    updateCourse(input: $input, condition: $condition) {
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
export const deleteCourse = /* GraphQL */ `
  mutation DeleteCourse(
    $input: DeleteCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    deleteCourse(input: $input, condition: $condition) {
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
export const createLecture = /* GraphQL */ `
  mutation CreateLecture(
    $input: CreateLectureInput!
    $condition: ModelLectureConditionInput
  ) {
    createLecture(input: $input, condition: $condition) {
      id
      course_ref
      title
      order
      createdAt
      updatedAt
    }
  }
`;
export const updateLecture = /* GraphQL */ `
  mutation UpdateLecture(
    $input: UpdateLectureInput!
    $condition: ModelLectureConditionInput
  ) {
    updateLecture(input: $input, condition: $condition) {
      id
      course_ref
      title
      order
      createdAt
      updatedAt
    }
  }
`;
export const deleteLecture = /* GraphQL */ `
  mutation DeleteLecture(
    $input: DeleteLectureInput!
    $condition: ModelLectureConditionInput
  ) {
    deleteLecture(input: $input, condition: $condition) {
      id
      course_ref
      title
      order
      createdAt
      updatedAt
    }
  }
`;
export const createUnit = /* GraphQL */ `
  mutation CreateUnit(
    $input: CreateUnitInput!
    $condition: ModelUnitConditionInput
  ) {
    createUnit(input: $input, condition: $condition) {
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
export const updateUnit = /* GraphQL */ `
  mutation UpdateUnit(
    $input: UpdateUnitInput!
    $condition: ModelUnitConditionInput
  ) {
    updateUnit(input: $input, condition: $condition) {
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
export const deleteUnit = /* GraphQL */ `
  mutation DeleteUnit(
    $input: DeleteUnitInput!
    $condition: ModelUnitConditionInput
  ) {
    deleteUnit(input: $input, condition: $condition) {
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
export const createMeetingGraphQL = /* GraphQL */ `
  mutation CreateMeetingGraphQL(
    $input: CreateMeetingInput!
    $condition: ModelMeetingConditionInput
  ) {
    createMeetingGraphQL(input: $input, condition: $condition) {
      meetingId
      title
      data
      createdAt
      updatedAt
    }
  }
`;
export const deleteMeetingGraphQL = /* GraphQL */ `
  mutation DeleteMeetingGraphQL(
    $input: DeleteMeetingInput!
    $condition: ModelMeetingConditionInput
  ) {
    deleteMeetingGraphQL(input: $input, condition: $condition) {
      meetingId
      title
      data
      createdAt
      updatedAt
    }
  }
`;
export const createAttendeeGraphQL = /* GraphQL */ `
  mutation CreateAttendeeGraphQL(
    $input: CreateAttendeeInput!
    $condition: ModelAttendeeConditionInput
  ) {
    createAttendeeGraphQL(input: $input, condition: $condition) {
      attendeeId
      meetingId
      name
      createdAt
      updatedAt
    }
  }
`;
export const deleteAttendeeGraphQL = /* GraphQL */ `
  mutation DeleteAttendeeGraphQL(
    $input: DeleteAttendeeInput!
    $condition: ModelAttendeeConditionInput
  ) {
    deleteAttendeeGraphQL(input: $input, condition: $condition) {
      attendeeId
      meetingId
      name
      createdAt
      updatedAt
    }
  }
`;
