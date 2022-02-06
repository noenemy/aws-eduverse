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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
