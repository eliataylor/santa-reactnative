import * as React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../config/colors";

interface Props {
  disabled?: boolean; // Add a "disabled" prop
  label: string;
  onPress: () => void;
}

class Button extends React.Component<Props> {
  render() {
    const { disabled, label, onPress, style, ...otherProps } = this.props;
    // If the button is disabled we lower its opacity
    const containerStyle = [
      {...this.props.style},
      styles.container,
      (disabled === true) ? styles.containerDisabled : styles.containerEnabled,
      style
    ];
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        disabled={disabled}
        {...otherProps}
        >
        <Text style={styles.text}>{label}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:colors.LIGHT_GREEN,
    paddingVertical:8,
    paddingHorizontal:8,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.7)"
  },
  containerEnabled: {
    opacity: 1
  },
  containerDisabled: {
    opacity: 0.3
  },
  text: {
    color: colors.WHITE,
    textAlign: "center",
  }
});

export default Button;
