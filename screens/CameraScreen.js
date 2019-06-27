import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image
} from "react-native";

const { FlashMode: CameraFlashModes, Type: CameraTypes } = Camera.Constants;
const { width: winWidth, height: winHeight } = Dimensions.get("window");
const SERVER_URL = "https://digestapi.ngrok.io";

export default class CameraScreen extends React.Component {
  camera = null;

  constructor(props) {
    super(props);
    this.state = {
      capture: null,
      // setting flash to be turned off by default
      flashMode: Camera.Constants.FlashMode.off,
      capturing: null,
      // start the back camera by default
      cameraType: Camera.Constants.Type.back,
      hasCameraPermission: null
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: `Camera`,
      headerBackTitle: `Back`,
      headerRight: (
        // <Button title="Library" onPress={() => params.pickImage()} />
        <TouchableOpacity
          style={styles.headerRight}
          onPress={() => params.pickImage()}
        >
          <Ionicons name="ios-photos" color="white" size={30} />
        </TouchableOpacity>
      ),
      headerStyle: {
        marginHorizontal: 5,
        backgroundColor: "cornflowerblue"
      },
      headerTintColor: "white",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };

  async componentDidMount() {
    // Sometimes not set before clicking on library
    this.props.navigation.setParams({
      pickImage: this.pickImage
    });

    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    const cameraRoll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const hasCameraPermission =
      camera.status === "granted" &&
      audio.status === "granted" &&
      cameraRoll.status === "granted";

    this.setState({ hasCameraPermission });
  }

  setFlashMode = flashMode => this.setState({ flashMode });
  setCameraType = cameraType => this.setState({ cameraType });

  handleShortCapture = async () => {
    const photoData = await this.camera.takePictureAsync();
    this.setState({
      capture: photoData
    });
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All
    });

    if (!result.cancelled) {
      this.setState({
        capture: result
      });
    }
  };

  onRetake = () => {
    this.setState({
      capture: null
    });
  };

  makeRequest = (url, method, body) => {
    // Create the XHR request
    var request = new XMLHttpRequest();

    // Return it as a Promise
    return new Promise((resolve, reject) => {
      // Setup our listener to process compeleted requests
      request.onreadystatechange = e => {
        // Only run if the request is complete
        if (request.readyState !== 4) return;

        // Process the response
        if (request.status >= 200 && request.status < 300) {
          // If successful
          resolve(request);
        } else {
          // If failed
          reject({
            status: request.status,
            statusText: request.statusText
          });
        }
      };

      // Setup our HTTP request
      request.open(method || "GET", url, true);

      // Send the request
      request.send(body);
    });
  };

  loadIngredients = dishes => {
    let ingredientRequests = [];
    dishes.forEach((dish, index) => {
      var body = new FormData();
      body.append("food_id", dish["food_id"]);
      body.append("language", "en");
      ingredientRequests.push(
        this.makeRequest(SERVER_URL + "/translate_ingredients", "POST", body)
      );
    });
    Promise.all(ingredientRequests).then(requests => {
      let ingredients = [];
      requests.forEach(result => {
        let formattedResult = result.response.replace(/'/g, '"');
        formattedResult = JSON.parse(formattedResult);
        ingredients.push(formattedResult.split(", "));
      });
      this.props.navigation.state.params.addCapture(
        this.state.capture,
        dishes,
        ingredients
      );
      this.props.navigation.navigate("DishesScreen", {
        menu: this.state.capture,
        dishes: dishes,
        ingredients: ingredients,
        allergies: this.props.navigation.state.params.allergies
      });
      this.setState({
        capture: null
      });
    });
  };

  onTranslate = () => {
    // Call API to get translation for image (capture)
    var photo = {
      uri: this.state.capture["uri"],
      type: "image/jpeg",
      name: "photo.jpg"
    };

    var body = new FormData();
    body.append("file", photo);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = e => {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status === 200) {
        let parsedResponse = xhr.responseText.replace(/'/g, '"');
        parsedResponse = JSON.parse(parsedResponse);
        this.loadIngredients(parsedResponse);
      } else {
        alert("Request failed, please try again.");
      }
    };
    xhr.open("POST", SERVER_URL + "/parse_text_from_image");
    xhr.send(body);
  };

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>Access to camera has been denied.</Text>;
    }

    if (this.state.capture === null) {
      return (
        <View style={styles.container}>
          <Camera
            type={this.state.cameraType}
            flashMode={this.state.flashMode}
            style={styles.preview}
            ref={camera => (this.camera = camera)}
          />
          <View style={styles.cameraFooter}>
            <TouchableOpacity
              onPress={() =>
                this.setCameraType(
                  this.state.cameraType === CameraTypes.back
                    ? CameraTypes.front
                    : CameraTypes.back
                )
              }
            >
              <Ionicons name="ios-reverse-camera" color="white" size={35} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleShortCapture()}>
              <Ionicons name="ios-radio-button-on" color="white" size={60} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.setFlashMode(
                  this.state.flashMode === CameraFlashModes.on
                    ? CameraFlashModes.off
                    : CameraFlashModes.on
                )
              }
            >
              <Ionicons
                name={
                  this.state.flashMode == CameraFlashModes.on
                    ? "ios-flash"
                    : "ios-flash-off"
                }
                color="white"
                size={35}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Image source={this.state.capture} style={styles.preview} />
          <View style={styles.cameraFooter}>
            <TouchableOpacity
              style={styles.captureRetake}
              onPress={() => this.onRetake()}
            >
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureTranslate}
              onPress={() => this.onTranslate()}
            >
              <Text style={styles.translateText}>Translate</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: 30
  },
  preview: {
    height: winHeight * 0.8,
    width: winWidth
  },
  cameraFooter: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "cornflowerblue",
    paddingTop: 4,
    paddingLeft: 15,
    paddingRight: 15
  },
  captureBtn: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 60,
    borderColor: "#FFFFFF"
  },
  captureRetake: {
    flex: 1,
    borderColor: "#FB9985",
    borderWidth: 3,
    backgroundColor: "white",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 20
  },
  captureTranslate: {
    flex: 1,
    borderColor: "#ffdb58",
    borderWidth: 3,
    backgroundColor: "white",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 20
  },
  retakeText: {
    color: "gray",
    fontSize: 17,
    fontWeight: "bold"
  },
  translateText: {
    color: "gray",
    fontSize: 17,
    fontWeight: "bold"
  },
  headerRight: {
    marginRight: 10
  }
});
