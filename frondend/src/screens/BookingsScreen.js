import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Header from '../components/Header';
import Colors from '../styles/Colors';

export default function BookingsScreen({navigation, route}) {
  const [A, setA] = useState(null);
  const [B, setB] = useState(null);
  const [bookings, setBookings] = useState(null);
  useEffect(() => {
    const b = route.params.token;
    const a = route.params.item._id;
    setB(b);
    setA(a);
    // fetchBookings();
  });

  const fetchBookings = () => {
    const Body = {
      query: `
      query {
        bookings {
          _id
         createdAt
         event {
           _id
           title
           date
           price
         }
        }
      }
    `,
    };

    fetch('https://event-booking-app-graphql.herokuapp.com/graphql', {
      method: 'POST',
      body: JSON.stringify(Body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + B,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          console.log(res.status);
          throw new Error('Failed!!!!!!!');
        }
        return res.json();
      })
      .then((resData) => {
        console.log('dsadas', resData);
        setBookings(resData.data.bookings);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const submitHandler = () => {
    const requestBody = {
      query: `
          mutation BookEvent($id: ID!) {
            bookEvent(eventId: $id) {
              _id
             createdAt
             updatedAt
            }
          }
        `,
      variables: {
        id: A,
      },
    };

    fetch('https://event-booking-app-graphql.herokuapp.com/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + B,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          console.log(res.status);
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteBookinghandler = (id) => {
    const Body = {
      query: `
      mutation {
        cancelBooking(bookingId:"${id}") {
          _id
         title
       }
      }
    `,
    };

    fetch('https://event-booking-app-graphql.herokuapp.com/graphql', {
      method: 'POST',
      body: JSON.stringify(Body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + B,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          console.log(res.status);
          throw new Error('Failed!!!!!!!');
        }
        return res.json();
      })
      .then((resData) => {
        console.log('deleted', resData);
        // setBookings(resData.data.bookings);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderItem = ({item}) => {
    console.log('aaa');
    return (
      <TouchableOpacity onPress={() => {}}>
        <View
          item={item}
          style={{
            backgroundColor: 'pink',
            marginHorizontal: 25,
            marginTop: 10,
          }}>
          <Text>{item.event.title}</Text>
          <Text>{item.createdAt}</Text>
          <Button
            title="cancel"
            onPress={() => {
              deleteBookinghandler(item._id);
            }}></Button>
        </View>
      </TouchableOpacity>
    );
  };
  console.log(bookings);
  return (
    <SafeAreaView style={{backgroundColor: Colors.green1, flex: 1}}>
      <Header pageName={'BOOK EVENT'} onBack={() => navigation.goBack()} />
      <Button title="book" onPress={submitHandler}></Button>
      <Button title="show list" onPress={fetchBookings}></Button>
      <FlatList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </SafeAreaView>
  );
}
