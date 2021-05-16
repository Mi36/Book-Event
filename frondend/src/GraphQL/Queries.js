import {gql} from '@apollo/client';

export const LOGIN = gql`
  query Root($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userId
      token
      tokenExpiration
    }
  }
`;
