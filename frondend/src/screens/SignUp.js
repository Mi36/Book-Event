import {gql, useMutation, useQuery} from '@apollo/client';
import React, {useState} from 'react';
import {Button, SafeAreaView, StyleSheet, Text} from 'react-native';
import {setAsyncStorage} from '../asyncStorage';
import {isLoggedInVar} from '../cache';
import Header from '../components/Header';
import Colors from '../styles/Colors';

//fragment use cheythittund ivide ath query reuse cheyyan vendi aanu.
//ivide mukalilathe queryil ulla part thaye use cheythirukkunnu
//fragmentinu oru udaharanam aanu ith.
//ath engane use cheyyam ennu thottu thayathe querikalil kanam
export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

export const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      site
      rocket {
        type
      }
      ...LaunchTile
    }
  }
  ${LAUNCH_TILE_DATA}
`;

//hasmore and curser
//hasmore-->indicated that there more data still to fetch.
//it is used to implement pagination in apps
// curser is a parameter clients current position from the total data we receved.
// 20 ennam aanu oru 100 il kittiyath enkil aa 20 ne soojippikkan ulla oru value
export const GET_LAUNCHES = gql`
  query GetLaunchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

//fetch more

export const GET_MY_TRIPS = gql`
  query GetMyTrips {
    me {
      id
      email
      trips {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

//mutations
export const LOGIN_USER = gql`
  mutation Login($email: String!) {
    login(email: $email) {
      id
      token
    }
  }
`;

//local query
const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

//@client makes call from local not from server
export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems @client
  }
`;

const SignUp = (props) => {
  const {data: cartData, loading: cartLoading, error: cartError} = useQuery(
    GET_CART_ITEMS,
  );
  const {data: loggedIn} = useQuery(IS_LOGGED_IN);
  console.log(`loggedIn`, loggedIn);

  const [
    login,
    {loading: loginLoading, error: loginError, data: loginData},
  ] = useMutation(LOGIN_USER, {
    onCompleted({login}) {
      if (login) {
        setAsyncStorage('token', login.token);
        setAsyncStorage('userId', login.id);
        isLoggedInVar(true);
      }
    },
  });

  if (loading) console.log(`loadingddddddddd`, loginLoading);
  if (error) console.log(`loginErrorrrrrrrrr`, loginError);
  if (data) console.log(`loginDataaaaaaaaaa`, loginData);

  const {
    data: trips,
    loading: tripsLoading,
    error: tripsError,
  } = useQuery(GET_MY_TRIPS, {fetchPolicy: 'network-only'});

  console.log(`trips,tripsError,tripsLoading`, trips, tripsError, tripsLoading);
  const {data, loading, error, fetchMore} = useQuery(GET_LAUNCHES);
  console.log('data,loading,error', data?.launches?.launches, loading, error);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const launchId = 109;
  const {
    data: individulaData,
    loading: individulaDataLoading,
    error: individulaDataError,
  } = useQuery(GET_LAUNCH_DETAILS, {
    variables: {launchId},
  });

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header pageName={'Register'} backButtonInvisible />
      {loading && <Text>Loading........</Text>}
      {data?.launches &&
        data?.launches.hasMore &&
        (isLoadingMore ? (
          <Text>Loading............</Text>
        ) : (
          <Button
            title="fetch"
            onPress={async () => {
              setIsLoadingMore(true);
              await fetchMore({
                variables: {
                  after: data.launches.cursor,
                },
              });

              setIsLoadingMore(false);
            }}></Button>
        ))}
      {data?.launches?.launches.map((item) => {
        return <Text key={item.id}>{item.id}</Text>;
      })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.green1,
    flex: 1,
    paddingHorizontal: 20,
  },
  mainContainer: {
    flexGrow: 1,
    backgroundColor: Colors.green1,
  },
});

export default SignUp;
