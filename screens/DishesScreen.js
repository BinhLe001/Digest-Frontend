import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  ActionSheetIOS
} from "react-native";

const { width: winWidth, height: winHeight } = Dimensions.get("window");
const FILTER_OPTIONS = ["Cancel", "Safe", "Unsafe", "All"];

export default class DishesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "All"
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      updateFilter: this.updateFilter
    });
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: `Dishes`,
      headerBackTitle: `Back`,
      headerRight: (
        <TouchableOpacity
          style={styles.headerRight}
          onPress={() =>
            ActionSheetIOS.showActionSheetWithOptions(
              {
                title: "According to preferences, filter dishes by",
                options: FILTER_OPTIONS,
                cancelButtonIndex: 0
              },
              buttonIndex => {
                params.updateFilter(buttonIndex);
              }
            )
          }
        >
          <Ionicons name="ios-options" color="white" size={30} />
        </TouchableOpacity>
      ),
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

  updateFilter = index => {
    if (index !== 0) {
      this.setState({
        filter: FILTER_OPTIONS[index]
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.dishList}
        >
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>
              {"Filter:  " + this.state.filter}
            </Text>
          </View>
          {this.props.navigation.state.params.dishes.map((dish, index) => {
            let dishUri = { uri: dish["img"] };

            let isSafe = true;
            let ingredientString = this.props.navigation.state.params.ingredients[
              index
            ].join(", ");
            this.props.navigation.state.params.allergies.forEach(allergen => {
              if (ingredientString.includes(allergen)) {
                isSafe = false;
              }
            });
            let dishRowStyle = isSafe
              ? styles.safeDishRow
              : styles.unsafeDishRow;

            if (
              (isSafe && this.state.filter === "Unsafe") ||
              (!isSafe && this.state.filter === "Safe")
            ) {
              return;
            } else {
              return (
                <TouchableOpacity key={index} style={styles.container}>
                  <View style={dishRowStyle}>
                    <View style={styles.dishLeft}>
                      <View>
                        <Text style={styles.dishTitle}>{dish["item"]}</Text>
                      </View>
                      <View>
                        <Text style={styles.dishText}>{ingredientString}</Text>
                      </View>
                    </View>
                    <View style={styles.dishRight}>
                      <Image source={dishUri} style={styles.dishImage} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }
          })}
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
  headerRight: {
    marginRight: 10
  },
  filterTitle: {
    fontSize: 24,
    lineHeight: 24,
    color: "gray"
  },
  filterHeader: {
    paddingTop: 20
  },
  dishImage: {
    height: 100,
    width: 120,
    borderRadius: 10,
    overflow: "hidden"
  },
  dishList: {
    paddingTop: 10,
    textAlign: "center",
    marginHorizontal: 20
  },
  dishTitle: {
    fontSize: 20,
    color: "cornflowerblue"
  },
  dishText: {
    marginTop: 10,
    fontSize: 14,
    color: "gray"
  },
  unsafeDishRow: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
    padding: 15,
    width: winWidth * 0.9,
    borderColor: "#FB9985",
    borderWidth: 3,
    borderRadius: 10
  },
  safeDishRow: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
    padding: 15,
    width: winWidth * 0.9,
    borderColor: "#ffdb58",
    borderWidth: 3,
    borderRadius: 10
  },
  dishLeft: {
    flex: 1
  },
  dishRight: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  }
});
