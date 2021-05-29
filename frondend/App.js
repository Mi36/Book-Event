/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import {onError} from '@apollo/client/link/error';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import {getAsyncStorage} from './src/asyncStorage';
import {GRAPH_QL_URL} from './src/common/constants';
import BookingsScreen from './src/screens/BookingsScreen';
import EventsScreen from './src/screens/EventsScreen';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';

const errorLink = onError(({graphQLErrors, networkError}) => {
  if (graphQLErrors) {
    graphQLErrors.map(({message, location, path}) => {
      alert(`Graphql error ${message}`);
    });
  }
});

const link = from([
  errorLink,
  new HttpLink({
    uri: GRAPH_QL_URL,
  }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache({}),
  headers: {
    authorization: getAsyncStorage('@storage_Key') || '',
  },
  link: link,
});

const Stack = createStackNavigator();
export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator
          headerMode="none"
          screenOptions={{animationEnabled: false}}>
          <Stack.Screen name="Register" component={SignUp} />
          <Stack.Screen name="Events" component={EventsScreen} />
          <Stack.Screen name="Bookings" component={BookingsScreen} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
