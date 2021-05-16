/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  from,
  ApolloProvider,
} from '@apollo/client';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignUp from './src/screens/SignUp';
import Login from './src/screens/Login';
import EventsScreen from './src/screens/EventsScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import {onError} from '@apollo/client/link/error';

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
    uri: 'https://event-booking-app-graphql.herokuapp.com/graphql',
  }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
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
