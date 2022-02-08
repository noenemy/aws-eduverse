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
      createdAt
      updatedAt
    }
  }
`;
