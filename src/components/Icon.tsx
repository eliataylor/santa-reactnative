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
    const { icon, label, onPress, tintColor, style } = this.props;

    const containerStyle = [styles.iconWrap];
    if (style) containerStyle.push(style);

    const imgStyle = {width: 24, height: 24, alignSelf:'center'};
    if (tintColor) {
      imgStyle.tintColor = tintColor;
    }

    return (
      <TouchableHighlight style={containerStyle} onPress={onPress} >
        <Image
          source={icon}
          style={imgStyle}
          resizeMode={'contain'}
          onError={(e) => console.log(e.nativeEvent.error) }
          accessibilityLabel={label} />
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    alignContent:'center'
  }
});

export default Icon;
