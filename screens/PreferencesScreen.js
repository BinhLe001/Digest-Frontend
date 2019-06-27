import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image
} from "react-native";

const { width: winWidth, height: winHeight } = Dimensions.get("window");

export default class PreferencesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLanguage: this.props.navigation.state.params.userLanguage,
      currentAllergies: this.props.navigation.state.params.allergies
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: `Preferences`,
      headerBackTitle: `Back`,
      headerStyle: {
        marginHorizontal: 8,
        backgroundColor: "cornflowerblue"
      },
      headerTintColor: "white",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };

  updateLanguage = language => {
    this.setState({
      currentLanguage: language
    });
    this.props.navigation.state.params.changeLanguage(language);
  };

  updateAllergies = allergy => {
    let newAllergies = this.state.currentAllergies;
    if (newAllergies.includes(allergy)) {
      var index = newAllergies.indexOf(allergy);
      newAllergies.splice(index, 1);
    } else {
      newAllergies.push(allergy);
    }
    this.setState({
      currentAllergies: newAllergies
    });
    this.props.navigation.state.params.changeAllergies(newAllergies);
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.containerList}
        >
          <View style={styles.languageSelect}>
            <Text style={styles.selectTitle}>Select your language:</Text>
            <View style={styles.selectRow}>
              <TouchableOpacity
                style={
                  this.state.currentLanguage === "en"
                    ? styles.selectedLanguage
                    : styles.unselectedLanguage
                }
                onPress={() => this.updateLanguage("en")}
              >
                <Text style={styles.optionText}>English (EN)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  this.state.currentLanguage === "zh"
                    ? styles.selectedLanguage
                    : styles.unselectedLanguage
                }
                onPress={() => this.updateLanguage("zh")}
              >
                <Text style={styles.optionText}>Chinese (ZH)</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.selectRow}>
              <TouchableOpacity
                style={
                  this.state.currentLanguage === "es"
                    ? styles.selectedLanguage
                    : styles.unselectedLanguage
                }
                onPress={() => this.updateLanguage("es")}
              >
                <Text style={styles.optionText}>Spanish (ES)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  this.state.currentLanguage === "fr"
                    ? styles.selectedLanguage
                    : styles.unselectedLanguage
                }
                onPress={() => this.updateLanguage("fr")}
              >
                <Text style={styles.optionText}>French (FR)</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.allergySelect}>
            <Text style={styles.selectTitle}>Select your allergies:</Text>
            <View style={styles.selectRow}>
              <TouchableOpacity
                style={
                  this.state.currentAllergies.includes("milk")
                    ? styles.selectedAllergen
                    : styles.unselectedAllergen
                }
                onPress={() => this.updateAllergies("milk")}
              >
                <Text style={styles.optionText}>Milk</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  this.state.currentAllergies.includes("egg")
                    ? styles.selectedAllergen
                    : styles.unselectedAllergen
                }
                onPress={() => this.updateAllergies("egg")}
              >
                <Text style={styles.optionText}>Egg</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.selectRow}>
              <TouchableOpacity
                style={
                  this.state.currentAllergies.includes("fish")
                    ? styles.selectedAllergen
                    : styles.unselectedAllergen
                }
                onPress={() => this.updateAllergies("fish")}
              >
                <Text style={styles.optionText}>Fish</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  this.state.currentAllergies.includes("shellfish")
                    ? styles.selectedAllergen
                    : styles.unselectedAllergen
                }
                onPress={() => this.updateAllergies("shellfish")}
              >
                <Text style={styles.optionText}>Shellfish</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.selectRow}>
              <TouchableOpacity
                style={
                  this.state.currentAllergies.includes("tree nut")
                    ? styles.selectedAllergen
                    : styles.unselectedAllergen
                }
                onPress={() => this.updateAllergies("tree nut")}
              >
                <Text style={styles.optionText}>Tree Nut</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  this.state.currentAllergies.includes("peanut")
                    ? styles.selectedAllergen
                    : styles.unselectedAllergen
                }
                onPress={() => this.updateAllergies("peanut")}
              >
                <Text style={styles.optionText}>Peanut</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.selectRow}>
              <TouchableOpacity
                style={
                  this.state.currentAllergies.includes("wheat")
                    ? styles.selectedAllergen
                    : styles.unselectedAllergen
                }
                onPress={() => this.updateAllergies("wheat")}
              >
                <Text style={styles.optionText}>Wheat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  this.state.currentAllergies.includes("soy")
                    ? styles.selectedAllergen
                    : styles.unselectedAllergen
                }
                onPress={() => this.updateAllergies("soy")}
              >
                <Text style={styles.optionText}>Soy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  containerList: {
    marginHorizontal: 20
  },
  selectTitle: {
    fontSize: 24,
    lineHeight: 24,
    color: "gray"
    // fontWeight: "bold"
  },
  selectedLanguage: {
    backgroundColor: "cornflowerblue",
    marginTop: 20,
    height: 50,
    width: winWidth * 0.3,
    borderColor: "#ffdb58",
    borderWidth: 5,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  unselectedLanguage: {
    backgroundColor: "cornflowerblue",
    marginTop: 20,
    height: 50,
    width: winWidth * 0.3,
    borderColor: "cornflowerblue",
    borderWidth: 5,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  selectedAllergen: {
    backgroundColor: "cornflowerblue",
    marginTop: 20,
    height: 50,
    width: winWidth * 0.3,
    borderColor: "#FB9985",
    borderWidth: 5,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  unselectedAllergen: {
    backgroundColor: "cornflowerblue",
    marginTop: 20,
    height: 50,
    width: winWidth * 0.3,
    borderColor: "cornflowerblue",
    borderWidth: 5,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  selectRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  languageSelect: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 30
  },
  allergySelect: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 30
  },
  optionText: {
    color: "white"
  },
  divider: {
    marginTop: 30,
    backgroundColor: "gray",
    height: 2
  }
});
