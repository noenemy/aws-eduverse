/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
