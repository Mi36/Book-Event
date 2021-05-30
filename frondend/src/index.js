//import gql from 'graphql-tag';
import {gql} from '@apollo/client';
export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }
`;
