import {ApolloClient, ApolloProvider, gql} from '@apollo/client';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import {cache} from './src/cache';
import BookingsScreen from './src/screens/BookingsScreen';
import EventsScreen from './src/screens/EventsScreen';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';

const client = new ApolloClient({
  cache,
  uri: 'http://localhost:4000/graphql',
});

client
  .query({
    query: gql`
      query TestQuery {
        launch(id: 56) {
          id
          mission {
            name
          }
        }
      }
    `,
  })
  .then((result) => console.log(result));

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
