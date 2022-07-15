import React, { useEffect, useState } from "react";
import axios from "axios";
import { StyleSheet, Text, View, TextInput, TextEdit, TouchableOpacity, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { API, API_CREATE, API_POSTS, PUT } from "../constants/API";
import { commonStyles, darkStyles, lightStyles } from "../styles/commonStyles";
import { updatePicAction } from "../redux/ducks/accountPref";

export default function EditScreen({ navigation, route }) {
  const [post, setPost] = useState('');
  //const [put, setPost] = useState({ title: "", content: "" });
  const picture = useSelector((state) => state.accountPrefs.postPicture);
  console.log('picute:', picture)
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [id, setId] = useState('');
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };
  

  useEffect(() => {
    const post = route.params.post;
    setTitle(post.title)
    setContent(post.content)
    setImage(post.image)
    setId(post.id)

  }, []);

  async function getPost() {
    
    try {
      const response = await axios.get(API + API_POSTS + "/" + id, {
        headers: { Authorization: `JWT ${token}` },
      });
      
      setPost(response.data);
    } catch (error) {
      
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
        <Image style={{resizeMode : 'cover', height: 250, width: '90%', marginLeft: 22, marginBottom: 20}} source={{uri: picture ?? image }}/>
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
        
        <TouchableOpacity onPress={() => navigation.navigate("blogCamera", {'fromEdit': true, post})}>
          <Text style={{ marginTop: 10, fontSize: 20, color: "#0000EE" }}>
          Edit your image.
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

  async function savePost() {
    const post = {
      title: title,
      content: content,
      id: id,
      image: picture ?? image,
    };
    console.log('savepost:', post)
  
    try {
      
      const response = await axios.put(API + API_POSTS + "/" + id, post, {
        headers: { Authorization: `JWT ${token}` },
      });
      dispatch({ ...dispatch(updatePicAction()), payload: null });
      navigation.navigate("Index");
    } catch (error) {
      console.log(error)
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