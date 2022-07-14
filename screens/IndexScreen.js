import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, FlatList, RefreshControl, Image} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { API, API_POSTS } from "../constants/API";
import { darkStyles, lightStyles } from "../styles/commonStyles";
import { useSelector } from 'react-redux'

export default function IndexScreen({ navigation, route }) {
  const token = useSelector((state)=>state.auth.token)
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = isDark ? darkStyles : lightStyles;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addPost}>
          <FontAwesome name="plus" size={24} style={{ color: styles.headerTint, marginRight: 15 }} />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      
      getPosts();
    });
    getPosts();
    return removeListener;
  }, []);

  async function getPosts() {
    try {
      const response = await axios.get(API + API_POSTS, {
        headers: { Authorization: `JWT ${token}` },
      })
      // 
      setPosts(response.data);
      return "completed"
    } catch (error) {
      
      if (error.response.data.error = "Invalid token") {
        navigation.navigate("SignInSignUp");
      }
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    const response = await getPosts()
    setRefreshing(false);
  }

  function addPost() {
    navigation.navigate("Add")
  }

  async function deletePost(id) {
    
    try {
      const response = await axios.delete(API + API_POSTS + `/${id}`, {
        headers: { Authorization: `JWT ${token}` },
      })
      
      setPosts(posts.filter((item) => item.id !== id));
    } catch (error) {
      
    }
  }

  // The function to render each row in our FlatList
  function renderItem({ item }) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("Details", {id: item.id})}>
        <View
          style={{
            padding: 10,
            paddingTop: 20,
            paddingBottom: 20,
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}>
          <Text style={styles.text}>{item.title}</Text>
          <View style={{flexDirection: 'row'}}>
          <Image style={{width: 100, height: 100}} source={{uri: item.image}} />
          <TouchableOpacity onPress={() => deletePost(item.id)} style={{marginLeft: "auto", marginTop: 60}}>
            <FontAwesome name="trash" size={40} color="#a80000" />
          </TouchableOpacity>
          </View>
        </View>

      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        
        data={posts}
        renderItem={renderItem}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl
          colors={["#9Bd35A", "#689F38"]}
          refreshing={refreshing}
          onRefresh={onRefresh}/>}
      />
    </View>
  );
}