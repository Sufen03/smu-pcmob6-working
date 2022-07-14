import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Image,
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { API, API_WHOAMI } from "../constants/API";
import { changeModeAction } from "../redux/ducks/accountPref";
import { commonStyles, darkStyles, lightStyles } from "../styles/commonStyles";
import { logOutAction } from "../redux/ducks/blogAuth";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";


export default function AccountScreen({ navigation }) {
  const profilePicture = useSelector((state)=> state.accountPrefs.profilePicture);
  const [username, setUsername] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const dispatch = useDispatch();
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };
  const picSize = new Animated.Value(200);

  function changePicSize() {
    Animated.loop(
      Animated.timing
      (picSize, {
      toValue: 1,
      duration: 500,
    })).start()
    Animated.spring(picSize, {
      toValue: 300,
      duration: 3500,
      friction: 2,
      tension: 140,
    }).start()
  }
  
  async function getUsername() {
    
    
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      
      setUsername(response.data.username);
    } catch (error) {
      
      if (error.response) {
        
        if (error.response.data.status_code === 401) {
          signOut();
          navigation.navigate("SignInSignUp");
        }
      } else {
        
      }
      // We should probably go back to the login screen???
    }
  }

  function signOut() {
    dispatch(logOutAction());
    navigation.navigate("SignInSignUp");
  }

  function switchMode() {
    
    dispatch(changeModeAction());
  }

  useEffect(() => {
    
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      
      setUsername(<ActivityIndicator />);
      getUsername();
    });
    getUsername();
    return removeListener;
  }, []);

  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      <Text style={[styles.title, styles.text, { marginTop: 30, fontSize: 42 }]}>
        {" "}
        Hello {username} !
      </Text>
      <TouchableWithoutFeedback onPress={changePicSize}>
      <Animated.Image
        source={{ uri: profilePicture }}
        style={{ width: picSize, height: picSize, borderRadius: 200 }}
      />
      </TouchableWithoutFeedback>
      <TouchableOpacity onPress={() => navigation.navigate("Camera", {'fromCreate': false})}>
        <Text style={{ marginTop: 10, fontSize: 20, color: "#0000EE" }}>
          {" "}
          No profile picture. Click to take one.{" "}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: 20,
        }}
      >
        <Text style={[styles.content, styles.text]}> Dark Mode? </Text>
        <Switch 
        value={isDark} 
        onChange={switchMode} 
        />
      </View>
      <TouchableOpacity style={[styles.button]} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}