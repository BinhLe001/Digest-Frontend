import * as WebBrowser from "expo-web-browser";
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

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelect: false,
      menus: [],
      dishes: [],
      ingredients: [],
      userLanguage: "en",
      selectedMenus: [],
      allergies: []
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      changeLanguage: this.changeLanguage,
      changeSelect: this.changeSelect,
      changeAllergies: this.changeAllergies,
      userLanguage: this.state.userLanguage,
      allergies: this.state.allergies
    });
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: `Menus`,
      headerBackTitle: `Back`,
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("PreferencesScreen", {
              changeLanguage: params.changeLanguage,
              changeAllergies: params.changeAllergies,
              userLanguage: params.userLanguage,
              allergies: params.allergies
            });
          }}
        >
          <Text style={styles.headerText}>Preferences</Text>
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => params.changeSelect()}>
          <Text style={styles.headerText}>Select</Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        marginHorizontal: 15,
        backgroundColor: "cornflowerblue"
      },
      headerTintColor: "white",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };

  changeAllergies = newAllergies => {
    this.setState({
      allergies: newAllergies
    });
  };

  changeLanguage = newLanguage => {
    this.setState({
      userLanguage: newLanguage
    });
    this.props.navigation.setParams({
      userLanguage: newLanguage
    });
  };

  changeSelect = () => {
    let newSelect = !this.state.isSelect;
    this.setState({
      isSelect: newSelect,
      selectedMenus: []
    });
  };

  navigateCamera = () => {
    this.props.navigation.navigate("CameraScreen", {
      addCapture: this.addCapture,
      allergies: this.state.allergies
    });
  };

  selectMenu = index => {
    let newSelectedMenus = this.state.selectedMenus;
    if (this.state.selectedMenus.includes(index)) {
      var indexToRemove = newSelectedMenus.indexOf(index);
      newSelectedMenus.splice(indexToRemove, 1);
    } else {
      newSelectedMenus.push(index);
    }
    this.setState({
      selectedMenus: newSelectedMenus
    });
  };

  openMenu = index => {
    this.props.navigation.navigate("DishesScreen", {
      menu: this.state.menus[index],
      dishes: this.state.dishes[index],
      ingredients: this.state.ingredients[index],
      allergies: this.state.allergies
    });
  };

  removeSelected = () => {
    let newMenus = [];
    let newDishes = [];
    let newIngredients = [];
    this.state.menus.forEach((menu, index) => {
      if (!this.state.selectedMenus.includes(index)) {
        newMenus.push(menu);
        newDishes.push(this.state.dishes[index]);
        newIngredients.push(this.state.ingredients[index]);
      }
    });
    this.setState({
      isSelect: false,
      menus: newMenus,
      dishes: newDishes,
      ingredients: newIngredients
    });
  };

  addCapture = (menu, dishes, ingredients) => {
    let newMenus = this.state.menus;
    newMenus.push(menu);
    let newDishes = this.state.dishes;
    newDishes.push(dishes);
    let newIngredients = this.state.ingredients;
    newIngredients.push(ingredients);
    this.setState({
      menus: newMenus,
      dishes: newDishes,
      ingredients: newIngredients
    });
  };

  render() {
    let menuStyle = this.state.isSelect ? styles.menuSelect : styles.menu;
    let menuAction = this.state.isSelect ? this.selectMenu : this.openMenu;
    let homeContent =
      this.state.menus.length === 0 ? (
        <View style={styles.infoView}>
          <Text style={styles.infoText}>
            press <Ionicons name="ios-add-circle" color="#F6E489" size={20} />{" "}
            to add menu
          </Text>
        </View>
      ) : (
        <View style={styles.menuList}>
          {this.state.menus.map(({ uri }, index) => {
            if (this.state.isSelect) {
              if (this.state.selectedMenus.includes(index)) {
                menuStyle = styles.selectedMenu;
              } else {
                menuStyle = styles.menuSelect;
              }
            }
            return (
              <TouchableOpacity key={index} onPress={() => menuAction(index)}>
                <Image source={{ uri }} style={menuStyle} />
              </TouchableOpacity>
            );
          })}
        </View>
      );
    let actionIcon = this.state.isSelect
      ? "ios-close-circle-outline"
      : "ios-add-circle";
    let actionFunction = this.state.isSelect
      ? this.removeSelected
      : this.navigateCamera;
    let actionColor = this.state.isSelect ? "#FB9985" : "#ffdb58";
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Digest</Text>
        </View>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View>{homeContent}</View>
        </ScrollView>
        <TouchableOpacity onPress={actionFunction} style={styles.addButton}>
          <Ionicons name={actionIcon} color={actionColor} size={90} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: 20,
    marginHorizontal: 20
    // alignItems: "center"
  },
  headerTitle: {
    fontSize: 32,
    lineHeight: 24,
    textAlign: "left",
    marginHorizontal: 20,
    paddingTop: 30,
    color: "gray",
    fontWeight: "bold"
  },
  menuList: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start"
    // alignItems: "flex-start"
  },
  menu: {
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "gray",
    height: 220,
    width: 220,
    borderRadius: 10,
    overflow: "hidden"
  },
  menuSelect: {
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "gray",
    height: 220,
    width: 220,
    borderRadius: 10,
    overflow: "hidden"
  },
  selectedMenu: {
    borderWidth: 5,
    borderColor: "#FB9985",
    marginBottom: 20,
    height: 220,
    width: 220,
    borderRadius: 10,
    overflow: "hidden"
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 30
  },
  infoText: {
    paddingTop: 180,
    fontSize: 22,
    color: "lightgray"
  },
  infoView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  headerText: {
    color: "white",
    fontSize: 17
  }
});
 