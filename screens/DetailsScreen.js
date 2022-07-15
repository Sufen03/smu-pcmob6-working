import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";
import axios from "axios";
import { API, API_POSTS } from "../constants/API";
import { useSelector } from "react-redux";

export default function ShowScreen({ navigation, route }) {
  const token = useSelector((state)=>state.auth.token);
  const [post, setPost] = useState({title: "", content: "", id: ''});
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={editPost} style={{marginRight: 10}}>
          <FontAwesome name="pencil-square-o" size={30} color={styles.headerTint} />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    getPost();
  }, [])

  async function getPost() {
    const id = route.params.id
    
    try {
      const response = await axios.get(API + API_POSTS + "/" + id, {
        headers: { Authorization: `JWT ${token}` },
      })
 
      setPost(response.data);
    } catch (error) {
      
      if (error.response.data.error = "Invalid token") {
        navigation.navigate("SignInSignUp");
      }
    }
  }

  function editPost() {
    navigation.navigate("Edit", { post: post })
    getPost();
  }
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.text, { margin: 40 }]}>{post.title}</Text>
      <Image style={{resizeMode : 'cover', marginLeft: 22 ,width: "90%", height: 250}} source={{uri: post.image}}/>
      <Text style={[styles.content, styles.text, { margin: 20 }]}>{post.content}</Text>
    </View>
  );
}