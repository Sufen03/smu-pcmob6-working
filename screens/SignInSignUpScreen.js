import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, UIManager, LayoutAnimation, ActivityIndicator, Keyboard, Image } from 'react-native';
import { API, API_LOGIN, API_SIGNUP } from '../constants/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logInAction } from '../redux/ducks/blogAuth';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
} //Needs to be manually enabled for android

export default function SignInSignUpScreen({ navigation }) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [isLogIn, setIsLogIn] = useState(true)
  const [confirmPassword, setConfirmPassword] = useState('')

  async function login() {
    
    Keyboard.dismiss();

    try {
      setLoading(true);
      const response = await axios.post(API + API_LOGIN, {
        username,
        password,
      });
      
      // 
      dispatch({...logInAction(), payload: response.data.access_token});
      setLoading(false);
      navigation.navigate("Logged In");
    } catch (error) {
      setLoading(false);
      
      
      setErrorText(error.response.data.description);
    }
  }

  async function signUp() {
    if (password != confirmPassword) {
      setErrorText("Your passwords don't match. Check and try again.")
    } else {
      try {
        setLoading(true);
        const response = await axios.post(API + API_SIGNUP, {
          username,
          password,
        });
        if (response.data.Error) {
          // We have an error message for if the user already exists
          setErrorText(response.data.Error);
          setLoading(false);
        } else {
          
          setLoading(false);
          login();
        }
      } catch (error) {
        setLoading(false);
        
        
        setErrorText(error.response.data.description);
      }
    }
  }
  return (
    <View style={styles.container}>
      <Image
          style={{resizeMode:'contain', height: 300, width: 500}}
          source={require('../assets/imageedit_1_3847856363.png')}
        />
      <Text style={styles.title}>
        {isLogIn ? "Log In" : "Sign Up"}
      </Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Username:"
          placeholderTextColor="#003f5c"
          onChangeText={(username) => setUsername(username)}
        />
      </View>
  
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Password:"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(pw) => setPassword(pw)}
        />
      </View>

      {isLogIn ? <View/> :
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Confirm Password:"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            onChangeText={(pw) => setConfirmPassword(pw)}
          />
        </View>}

      <View/>
      <View>
        <View style={{flexDirection: "row"}}>
          <TouchableOpacity 
          style={styles.button} 
          onPress={ isLogIn ? login : signUp}>
            <Text style={styles.buttonText}> 
            {isLogIn ? "Log In" 
            : "Sign Up"} 
            </Text>
          </TouchableOpacity>
          {loading ? <ActivityIndicator style={{ marginLeft: 10 }}/> : <View/>}
        </View>
      </View>
      <Text style={styles.errorText}>
        {errorText}
      </Text>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext({
            duration: 700,
            create: { type: 'linear', property: 'opacity' },
            update: { type: 'spring', springDamping: 0.4 }
          });
          setIsLogIn(!isLogIn);
          setErrorText("");
        }}>
          <Text style={styles.switchText}> 
          {isLogIn 
          ? "No account? Sign up now." 
          : "Already have an account? Log in here."}
          </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lavender',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 40, 
    margin: 20
  },
  switchText: {
    fontWeight: '400',
    fontSize: 20, 
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },
  button: {
    backgroundColor: '#6495ed',
    borderRadius: 25,
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 20, 
    margin: 20,
    color: 'black'
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginTop: 20
  }
});