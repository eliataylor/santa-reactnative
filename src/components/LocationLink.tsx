import * as React from "react";
import { StyleSheet, Linking, View, TouchableOpacity, Text, Image } from "react-native";
import colors from "../config/colors";
import Config from "../Config";

interface Props {
  number:string;
  name: string;
  street1:string;
  street2:string;
  geo:string;
}

class LocationLink extends React.Component<Props> {
  _onPress = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${this.props.geo[1]},${this.props.geo[0]}`;
    const label = 'Wish Location';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    //console.log("open url" + url);
    Linking.openURL(url);
  };

  buildAddress = () => {
    var address = [];
    var props = {'number':'', 'name':'', 'street1':'', 'street2':'', 'suburb':'', 'state':'', 'postcode':'', 'country':''};
    for(var p in props) {
      if (this.props[p]) {
        address.push(this.props[p])
      }
    }
    return address.join(' ');
  }

  buildImg = () => {
    var url = "https://maps.googleapis.com/maps/api/streetview?size=300x200&fov=120&key="+ Config.api.gMapKey;
    var address = this.buildAddress();
    if (address) {
      url += '&location=' + address;
    } else if (this.props.geo && this.props.geo.length === 2) {
      url += '&location=' + this.props.geo[1] + ',' + this.props.geo[0];
    } else {
      console.warn("every wish must have a valid location");
      return ''; // every wish
    }
    url += "&signature=" + Config.api.gMapSignature;
    return url;
  }

  render() {
    const address = this.buildAddress();
    const imgUrl = this.buildImg();
    console.log(address, imgUrl);

    return (
      <View onPress={this._onPress}
        style={styles.container}
        >
        {imgUrl.length > 0 ?
          <Image resizeMode={'contain'}
            style={styles.image}
            title={address} alt={address}
            source={{uri: imgUrl}}
            style={{width:300, height:200}}
          />
          :
          <Text>{address}</Text>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image : {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center"
  }
});

export default LocationLink;
