import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';

export default class EventsScreen extends Component {
  state = {
    date: new Date(),
    title: '',
    price: '',
    description: '',
    token: null,
    events: null,
    userId: null,
    loading: false,
    dummy: false,
  };
  componentDidMount() {
    this.getData();
    this.fetchData();
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      const userId = await AsyncStorage.getItem('@userId');
      if (value !== null) {
        this.setState({token: value});
        this.setState({userId});
        return;
      }
    } catch (e) {
      // error reading value
    }
  };

  removeValue = async () => {
    try {
      await AsyncStorage.removeItem('@storage_Key');
      await AsyncStorage.removeItem('@userId');
      this.props.navigation.navigate('Login');
    } catch (e) {
      // remove error
    }

    console.log('Done.');
  };

  fetchData = () => {
    this.setState({loading: true});
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        this.setState({events: resData.data.events, loading: false});
        // const events = resData.data.events;
        // if (this.isActive) {
        //   this.setState({events: events, isLoading: false});
        // }
      })
      .catch((err) => {
        console.log(err);
        if (this.isActive) {
          this.setState({loading: false});
        }
      });
  };

  bookEvents = () => {
    const requestBody = {
      query: `
          mutation {
            bookEvent(eventId:"${this.state.selectedEvent._id}") {
              _id
            createdAt
            updatedAt
           
            }
          }
        `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        this.setState({events: resData.data.event});
        // const events = resData.data.events;
        // if (this.isActive) {
        //   this.setState({events: events, isLoading: false});
        // }
      })
      .catch((err) => {
        if (this.isActive) {
          this.setState({isLoading: false});
        }
      });
  };

  submitHandler = () => {
    const {title, description, date} = this.state;
    const price = +this.state.price;

    const requestBody = {
      query: `
          mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
            createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
              _id
              title
              description
              date
              price
            }
          }
        `,
      variables: {
        title: title,
        desc: description,
        price: price,
        date: date,
      },
    };

    fetch('http://192.168.18.9:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.token,
      },
    })
      .then((res) => {
        console.log(res.status);
        if (res.status !== 200 && res.status !== 201) {
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

  renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('Bookings', {
            item: item,
            token: this.state.token,
          });
        }}>
        <View
          item={item}
          style={{
            backgroundColor: 'pink',
            marginHorizontal: 25,
            marginTop: 10,
          }}>
          <Text>{item.title}</Text>
          {this.state.userId === item.creator._id && (
            <Text>You are the owner of the event</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <View>
        <TextInput
          style={styles.input}
          placeholder="Title"
          onChangeText={(title) => {
            this.setState({title});
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          onChangeText={(price) => {
            this.setState({price});
          }}
        />

        <DateTimePicker
          testID="dateTimePicker"
          value={this.state.date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || this.state.date;
            console.log(currentDate);
            this.setState({date: currentDate});
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          onChangeText={(description) => {
            this.setState({description});
          }}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => {}}>
            <Text>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.submitHandler}>
            <Text>CREATE EVENT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.removeValue}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
        {this.state.loading ? (
          <Text>loading...</Text>
        ) : (
          <FlatList
            data={this.state.events}
            renderItem={this.renderItem}
            keyExtractor={(item) => item._id}
          />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  input: {
    margin: 15,
    borderColor: 'black',
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonStyle: {
    width: 100,
    height: 25,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
