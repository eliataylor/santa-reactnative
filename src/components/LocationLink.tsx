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

  buildImg = (type) => {
    var url = 'https://maps.googleapis.com/maps/api/', param = "";
    if (type === 'streetview') {
      url += "streetview?size=170x100&fov=120";
      param = "location";
    } else {
      url += "staticmap?zoom=4&size=170x100&maptype=roadmap";
      param = "center";
    }
    var address = this.buildAddress();
    if (this.props.geo && this.props.geo.length === 2) {
      url += '&'+param+'='  + this.props.geo[1] + ',' + this.props.geo[0];
    } else if (address) {
      url += '&'+param+'=' + encodeURIComponent(address);
    } else {
      console.warn("every wish must have a valid location");
      return ''; // every wish
    }
    // url += "&signature=" + Config.api.gMapSignature;
    return url + "&key="+ Config.api.gMapKey;
  }

  render() {
    const maptype = this.props.maptype || 'staticmap';
    const address = this.buildAddress();
    const imgUrl = this.buildImg(maptype);
    //console.log(address, imgUrl);

    return (
      <TouchableOpacity onPress={this._onPress}
        style={styles.container}
        >
        {imgUrl.length > 0 ?
          <Image resizeMode={'contain'}
            onError={(e) => console.log(e.nativeEvent.error) }
            style={styles.image}
            accessibilityLabel={address}
            source={{uri: imgUrl}}
          />
          :
          <Text>{address}</Text>
        }
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height:100,
  },
  image : {
    flex: 1,
    height:100,
    resizeMode: "contain",
    alignSelf: "center"
  }
});

export default LocationLink;
