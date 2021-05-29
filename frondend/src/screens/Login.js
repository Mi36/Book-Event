import {useLazyQuery, useMutation} from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {setAsyncStorage} from '../asyncStorage';
import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';
import KeyboardAvoidingViewWrapper from '../components/KBAvoidingView';
import {CREATE_EVENT} from '../GraphQL/Mutations';
import {LOGIN} from '../GraphQL/Queries';
import Colors from '../styles/Colors';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // normal query fetching
  // const {error, loading, data} = useQuery(LOGIN, {
  //   variables: {
  //     email: email,
  //     password: password,
  //   },
  // });

  //query fetching according to user click
  const [login, {loading, data, error}] = useLazyQuery(LOGIN, {
    variables: {
      email: email,
      password: password,
    },
  });

  useEffect(() => {
    if (data) {
      console.log(data.login);
      setAsyncStorage('@storage_Key', data.login.token);
      setAsyncStorage('@userId', data.login.userId);
      props.navigation.navigate('Events');
    }
    if (error) {
      console.log(error);
    }
  }, [data, loading, error]);

  const submitHandler = () => {
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    login();
  };

  return (
    <SafeAreaView style={{flexGrow: 1, backgroundColor: Colors.green1}}>
      <Header pageName={'Login'} onBack={() => props.navigation.goBack()} />
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
          <Button label={'Login'} onPress={submitHandler} />
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

export default Login;
