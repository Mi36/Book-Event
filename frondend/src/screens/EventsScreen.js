import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';

export default class EventsScreen extends Component {
  state = {
    date: new Date(1598051730000),
    title: '',
    price: '',
    description: '',
    token: null,
    events: null,
  };
  componentDidMount() {
    this.getData();
    this.fetchData();
    console.log('sdds', this.state.events);
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        this.setState({token: value});
        return;
      }
    } catch (e) {
      // error reading value
    }
  };

  removeValue = async () => {
    try {
      await AsyncStorage.removeItem('@storage_Key');
      this.props.navigation.navigate('Login');
    } catch (e) {
      // remove error
    }

    console.log('Done.');
  };

  fetchData = () => {
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
        this.setState({events: resData});
        // const events = resData.data.events;
        // if (this.isActive) {
        //   this.setState({events: events, isLoading: false});
        // }
      })
      .catch((err) => {
        console.log(err);
        if (this.isActive) {
          this.setState({isLoading: false});
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
        console.log(resData);
        this.setState({events: resData});
        // const events = resData.data.events;
        // if (this.isActive) {
        //   this.setState({events: events, isLoading: false});
        // }
      })
      .catch((err) => {
        console.log(err);
        if (this.isActive) {
          this.setState({isLoading: false});
        }
      });
  };

  submitHandler = () => {
    console.log(this.state);
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

    console.log('WORKED', this.state.token);
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
        // if (resData.data.login.token) {
        //   this.context.login(
        //     resData.data.login.token,
        //     resData.data.login.userId,
        //     resData.data.login.tokenExpiration,
        //   );
        // }
      })
      .catch((err) => {
        console.log(err);
      });
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
        <TextInput
          style={styles.input}
          placeholder="Date"
          value={this.state.date}
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
