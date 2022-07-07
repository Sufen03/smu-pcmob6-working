import React, { useEffect, useState } from "react";
import axios from "axios";
import { StyleSheet, Text, View, TextInput, TextEdit, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { API, API_CREATE, API_POSTS, PUT } from "../constants/API";
import { commonStyles, darkStyles, lightStyles } from "../styles/commonStyles";

export default function EditScreen({ navigation, route }) {
  // const [post, setPost] = useState({ title: "", content: "" });
  //const [put, setPost] = useState({ title: "", content: "" });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };

  useEffect(() => {
    // getPost();
    const post = route.params.post;
    setTitle(post.title)
    setContent(post.content)
  }, []);

  async function getPost() {
    const id = route.params.id;
    console.log(id);
    try {
      const response = await axios.get(API + API_POSTS + "/" + id, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response.data);
      setPost(response.data);
    } catch (error) {
      console.log(error.response.data);
      if ((error.response.data.error = "Invalid token")) {
        navigation.navigate("SignInSignUp");
      }
    }
  }

  function editPost() {
    navigation.navigate("Edit");
  }

  return (
    <View style={styles.container}>
      <View style={{ margin: 20 }}>
        <Text style={[additionalStyles.label, styles.text]}>Edit Title:</Text>
        <TextInput
          style={additionalStyles.input}
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>
          Edit Details:
        </Text>
        <TextInput
          style={additionalStyles.input}
          value={content}
          onChangeText={(text) => setContent(text)}
        />
        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={savePost}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  async function savePost() {
    const post = {
      title: title,
      content: content,
    };
    const id = route.params.post.id
    try {
      console.log(token);
      const response = await axios.put(API + API_POSTS + "/" + id, post, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response.data);
      navigation.navigate("Index");
    } catch (error) {
      console.log(error);
    }
  }

  // return (
  //   <View style={styles.container}>
  //     <Text style={[styles.title, styles.text, { margin: 40 }]}>
  //       {post.title}
  //     </Text>
  //     <Text style={[styles.title, styles.text, { margin: 20 }]}>
  //       {post.content}
  //     </Text>
  //   </View>
  // );

  // return (
  //   <View style={styles.container}>
  //     <Text style={[styles.text, styles.title, { marginTop: 20 }]}>
  //        Edit Screen
  //      </Text>
  //   </View>
  // );
}

//const styles = StyleSheet.create({});

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