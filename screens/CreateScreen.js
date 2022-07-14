import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image
} from "react-native";
import axios from "axios";
import { API, API_CREATE } from "../constants/API";
import { commonStyles, darkStyles, lightStyles } from "../styles/commonStyles";
import { useSelector } from "react-redux";

export default function CreateScreen({ navigation, route }) {
  const token = useSelector((state)=>state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  
  const image = route.params?.image
  
  
  async function savePost() {
    const post = {
      title: title,
      content: content,
      image: image,
    };
    try {
      
      const response = await axios.post(API + API_CREATE, post, {
        headers: { Authorization: `JWT ${token}` },
      });
      
      navigation.navigate("Index", { post: post });
    } catch (error) {
      
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ margin: 20 }}>
      <Image style={{width: 390, height: 250, marginBottom: 15}} source={{uri: image}}/>
        <Text style={[additionalStyles.label, styles.text]}>Enter Title:</Text>
        <TextInput
          style={additionalStyles.input}
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>
          Enter Content:
        </Text>
        <TextInput
          style={additionalStyles.input}
          value={content}
          onChangeText={(text) => setContent(text)}
        />
        

        <TouchableOpacity onPress={() => navigation.navigate("blogCamera", {'fromCreate': true})}>
          <Text style={{ marginTop: 10, fontSize: 20, color: "#0000EE" }}>
          {" "}
          Click to take a picture.{" "}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={savePost}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const additionalStyles = StyleSheet.create({
  input: {
    fontSize: 24,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 15,
  },
  label: {
    fontSize: 28,
    marginBottom: 10,
    marginLeft: 5,
  },
});