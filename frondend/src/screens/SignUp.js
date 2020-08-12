import React, {Component} from 'react';
import {Text, View, TextInput, TouchableOpacity, Button} from 'react-native';

export default class SignUp extends Component {
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

    const requestBody = {
      query: `
        mutation{
            createUser(userInput:{email:"${email}",password:"${password}"}){
                _id
                email
            }
        }`,
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