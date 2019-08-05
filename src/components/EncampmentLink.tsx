import * as React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import colors from "../config/colors";

interface Props {
  number:string;
  name: string;
  street1:string;
  street2:string;
  geo:string;
}

class EncampmentLink extends React.Component<Props> {
  render() {
    var address = [];
    var props = {'number':'', 'name':'', 'street2':'', 'geo':''};
    for(var p in props) {
      if (this.props[props[p]]) {
        address.push(this.props[props[p]])
      }
    }

    return (
      <TouchableOpacity
        style={styles.container}
        >
        <Text>{address.join(' ')}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  }
});

export default EncampmentLink;
