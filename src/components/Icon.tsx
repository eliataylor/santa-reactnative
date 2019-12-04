import * as React from "react";
import { StyleSheet, Image, TouchableHighlight } from "react-native";
import colors from "../config/colors";

interface Props {
  label: string;
  icon: object;
  onPress: () => void;
}

class Icon extends React.Component<Props> {
  render() {
    const { icon, label, onPress, style, ...otherProps } = this.props;

    const containerStyle = [styles.container];
    if (style) containerStyle.push(style);

    return (
      <TouchableHighlight
        style={containerStyle}
        onPress={onPress}
        {...otherProps}>
        <Image
          source={icon}
          style={{width: 24, height: 24, alignSelf:'center'}}
          resizeMode={'contain'}
          onError={(e) => console.log(e.nativeEvent.error) }
          accessibilityLabel={label} />
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    alignContent:'stretch'
  }
});

export default Icon;
