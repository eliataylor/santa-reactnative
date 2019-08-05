import * as React from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import colors from "../config/colors";

import iconEl from "../assets/boomboxcropped.png";

interface Props {
  name: string;
  onPress: () => void;
  svg:string;
}

class CategoryIcon extends React.Component<Props> {
  render() {
    const { name, onPress, svg } = this.props;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        >
        <Image title={name} alt={name} source={iconEl} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    backgroundColor: colors.DODGER_BLUE,
    margin:4,
    padding:3,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.7)"
  }
});

export default CategoryIcon;
