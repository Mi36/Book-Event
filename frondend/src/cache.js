import {InMemoryCache, makeVar} from '@apollo/client';
import {getAsyncStorage} from './asyncStorage';

//----------------------------------------------------------------------//
//to add local state managemnt
//creating to variables here

// Initializes to true if localStorage includes a 'token' key,
// false otherwise
let token;

getAsyncStorage('token').then(() => {});
export const isLoggedInVar = makeVar(!!token);

// Initializes to an empty array
export const cartItemsVar = makeVar([]);

//-----------------------------------------------------------------------//

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          },
        },
        cartItems: {
          read() {
            return cartItemsVar();
          },
        },
        launches: {
          keyArgs: false,
          merge(existing, incoming) {
            let launches = [];
            if (existing && existing.launches) {
              launches = launches.concat(existing.launches);
            }
            if (incoming && incoming.launches) {
              launches = launches.concat(incoming.launches);
            }
            return {
              ...incoming,
              launches,
            };
          },
        },
      },
    },
  },
});
