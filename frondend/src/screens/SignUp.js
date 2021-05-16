import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import Colors from '../styles/Colors';
import {useMutation} from '@apollo/client';
import {CREATE_USER} from '../GraphQL/Mutations';
import KeyboardAvoidingViewWrapper from '../components/KBAvoidingView';

const SignUp = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [createUser, {error, data}] = useMutation(CREATE_USER);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        props.navigation.navigate('Events');
      }
    } catch (e) {
      // error reading value
    }
  };

  const submitHandler = () => {
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    createUser({
      variables: {
        userInput: {
          email: email,
          password: password,
        },
      },
    });
    if (data) {
      props.navigation.navigate('Login');
    }
    if (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{flexGrow: 1, backgroundColor: Colors.green1}}>
      <Header pageName={'Register'} backButtonInvisible />
      <KeyboardAvoidingViewWrapper>
        <View style={styles.main}>
          <Input
            textContentType="emailAddress"
            autoCompleteType="email"
            keyboardType="email-address"
            returnKeyType="next"
            placeholder="email"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            placeholder="password"
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
          <Button label={'Register'} onPress={submitHandler} />
          <Button
            label="Go to Login"
            onPress={() => props.navigation.navigate('Login')}
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.green1,
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default SignUp;
