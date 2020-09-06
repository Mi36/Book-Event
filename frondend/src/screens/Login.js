import React, {Component} from 'react';
import {Text, View, TextInput, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  submitHandler = () => {
    const email = this.state.email;
    const password = this.state.password;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const request = {
      query: `
          query {
            login(email: "${email}", password: "${password}") {
              userId
              token
              tokenExpiration
            }
          }
        `,
    };

    fetch('http://192.168.18.9:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(request),
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
        AsyncStorage.setItem('@storage_Key', resData.data.login.token);
        AsyncStorage.setItem('@userId', resData.data.login.userId);
      })
      .then(() => {
        this.props.navigation.navigate('Events');
      })
      .catch((err) => {
        console.log('as', err);
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
      </View>
    );
  }
}
