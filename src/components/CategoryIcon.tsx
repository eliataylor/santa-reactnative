import * as React from "react";
import { StyleSheet, TouchableHighlight, Image, Text } from "react-native";
import colors from "../config/colors";

const AcademicsIcon = require("../assets/images/academics.png");
const ArtsIcon = require("../assets/images/arts.png");
const ClothesIcon = require("../assets/images/clothes.png");
const FirstAid = require("../assets/images/firstaid.png");
const FoodIcon = require("../assets/images/food.png");

interface Props {
  name: string;
  onPress: () => void;
  disabled:boolean;
}

class CategoryIcon extends React.Component<Props> {

  render() {
    const { name, onPress, id, disabled } = this.props;
    var iconEl = null;
    if (name === 'Arts' || id == '5d34461c274db5adac4a8d38') {
      iconEl = require("../assets/images/arts.png");
    } else if (name === 'Clothes' || id == '5d34461c274db5adac4a8d36') {
      iconEl = require("../assets/images/clothes.png");
    } else if (name === 'First Aid' || id == '5d34461c274db5adac4a8d37') {
      iconEl = require("../assets/images/firstaid.png");
    } else if (name === 'Academics' || id == '5d34461c274db5adac4a8d39') {
      iconEl = require("../assets/images/academics.png");
    } else if (name === 'Food' || id == '5d34461c274db5adac4a8d35') {
      iconEl = require("../assets/images/food.png");
    }

    if (name) {
      console.log("INTERNAL " + name + ' ' + disabled);
    }


    let containerStyle = [
      styles.container,
      (disabled === true) ? styles.containerDisabled : styles.containerEnabled
    ];

    return (
      <TouchableHighlight
        style={containerStyle}
        onPress={onPress}
        >
        <Image  resizeMode={'contain'}
          onError={(e) => console.log(e.nativeEvent.error) }
          style={styles.icon}
          accessibilityLabel={name}
          source={iconEl} />
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    margin:4,
    padding:3,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(000,000,000,0.7)"
  },
  icon: {
    flex: 1,
    width: "100%",
    height:"100%",
    resizeMode: "contain",
    alignSelf: "center"
  },
  containerEnabled: {
    opacity: 1
  },
  containerDisabled: {
    opacity: 0.3
  },
});

export default CategoryIcon;
