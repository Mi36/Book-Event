import React, {Component} from 'react';
import {Text, View, TextInput, TouchableOpacity, Button} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      console.log(value);
      if (value !== null) {
        this.props.navigation.navigate('Events');
      }
    } catch (e) {
      // error reading value
    }
  };
  submitHandler = () => {
    const email = this.state.email;
    const password = this.state.password;
    console.log(email, password);
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const requestBody = {
      query: `
        mutation{
            createUser(userInput:{email:"${email}",password:"${password}"}){
                _id
                email
            }
        }`,
    };

    fetch('https://event-booking-app-graphql.herokuapp.com/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
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
          placeholder="email"
          autoCapitalize="none"
          style={{
            marginHorizontal: 10,
            borderWidth: 2,
            borderColor: 'black',
            marginVertical: 10,
          }}
          value={this.state.email}
          onChangeText={(text) => this.setState({email: text})}
        />
        <TextInput
          placeholder="password"
          autoCapitalize="none"
          style={{
            marginHorizontal: 10,
            borderWidth: 2,
            borderColor: 'black',
            marginVertical: 10,
          }}
          value={this.state.password}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity
          onPress={this.submitHandler}
          style={{
            width: '100%',
            height: 45,
            backgroundColor: 'pink',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>Submit</Text>
        </TouchableOpacity>

        <Button
          title="Go to Login"
          onPress={() => this.props.navigation.navigate('Login')}
        />
      </View>
    );
  }
}
