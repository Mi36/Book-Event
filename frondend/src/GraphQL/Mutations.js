import {gql} from '@apollo/client';

export const CREATE_EVENT = gql`
  mutation Root($eventInput: EventInput) {
    createEvent(eventInput: $eventInput) {
      description
      _id
      price
      creator {
        password
        email
        _id
        createdEvents {
          title
        }
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation Root($userInput: UserInput) {
    createUser(userInput: $userInput) {
      password
      email
      _id
      createdEvents {
        _id
      }
    }
  }
`;
