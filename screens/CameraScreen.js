import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";
import { darkStyles, lightStyles } from "../styles/commonStyles";
import { useDispatch, useSelector } from "react-redux";
import { updatePicAction, uploadPicAction } from "../redux/ducks/accountPref";

export default function CameraScreen({ navigation, route }) {
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = isDark ? darkStyles : lightStyles;
  const dispatch = useDispatch();

  const [hasPermission, setHasPermission] = useState(null);
  const [back, setBack] = useState(true);
  const cameraRef = useRef(null);

  async function showCamera() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
    if (hasPermission === false) {
      Alert.alert("Error: No access given");
    }
  }

  function flip() {
    setBack(!back);
  }

  async function takePicture() {
    const fromCreate = route.params?.fromCreate
    const fromEdit = route.params?.fromEdit
    const post = route.params?.post
    

    const photo = await cameraRef.current.takePictureAsync();
    // 
    if (fromCreate){
      // if (from create screen)
    const { uri } = photo;
    navigation.navigate("Add", {'image': uri })
    } 
    else if(fromEdit){
      const { uri } = photo;
      dispatch({ ...dispatch(updatePicAction()), payload: photo.uri });
    navigation.navigate("Edit")
    }
    else {
        // if (from account screen)
    dispatch({ ...dispatch(uploadPicAction()), payload: photo.uri });
    navigation.navigate("Account");
    }
    
    

  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={flip}>
          <FontAwesome
            name="refresh"
            size={24}
            style={{ color: styles.headerTint, marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    showCamera();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={additionalStyles.camera}
        type={back ? Camera.Constants.Type.back : Camera.Constants.Type.front}
        ref={cameraRef}
      >
        <View style={additionalStyles.innerView}>
          <View style={additionalStyles.buttonView}>
            <TouchableOpacity
              onPress={takePicture}
              style={[
                additionalStyles.circleButton,
                { backgroundColor: isDark ? "black" : "white" },
              ]}
            />
          </View>
        </View>
      </Camera>
    </View>
  );
}

const additionalStyles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  circle: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  circleButton: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
  },
  buttonView: {
    alignSelf: "center",
    flex: 1,
    alignItems: "center",
  },
  innerView: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
  },
});