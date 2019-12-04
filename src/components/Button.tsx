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

    const containerStyle = [styles.container];
    if (style) containerStyle.push(style);
    containerStyle.push( (disabled === true) ? styles.containerDisabled : styles.containerEnabled );


    const textStyle = [styles.text];
    if (style && typeof style.color !== 'undefined') {
      textStyle.push({color:style.color});
    }
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        disabled={disabled}
        {...otherProps}
        >
        <Text style={textStyle}>{label}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf:'stretch',
    justifyContent:'center',
    paddingVertical:8,
    paddingHorizontal:4,
    borderRadius: 4,
    borderWidth:0,
    backgroundColor:colors.LIGHT_GREEN,
  },
  containerEnabled: {
    opacity: 1
  },
  containerDisabled: {
    opacity: 0.4,
  },
  text: {
    fontFamily:'Poppins-ExtraBold',
    color: colors.WHITE,
    textAlign: "center",
  }
});

export default Button;
