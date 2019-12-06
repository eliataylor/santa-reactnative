import * as React from "react";
import { Linking, View, TouchableOpacity, Text, Image } from "react-native";
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

  render() {
    const maptype = this.props.maptype || 'staticmap';
    const width = (this.props.width) ? parseInt(this.props.width, 0) : 170;
    const height = (this.props.height) ? parseInt(this.props.height, 0) : 100;
    const address = this.buildAddress();

    var imgUrl = 'https://maps.googleapis.com/maps/api/' + maptype + "?size="+width+"x"+height + "&key="+ Config.api.gMapKey;
    var param = "";
    if (maptype === 'streetview') {
      imgUrl += "&fov=120";
      param = "location";
    } else {
      imgUrl += "&zoom=14&maptype=roadmap";
      param = "center";
    }
    if (this.props.geo && this.props.geo.length === 2) {
      imgUrl += '&'+param+'='  + this.props.geo[1] + ',' + this.props.geo[0];
      if (maptype === 'staticmap') {
        imgUrl += "&markers=color:0xBE2625%7C"+this.props.geo[1] + ',' + this.props.geo[0];
      }
    } else if (address) {
      imgUrl += '&'+param+'=' + encodeURIComponent(address);
    } else {
      console.warn("every wish must have a valid location");
      imgUrl = '';
    }

    //console.log(address, imgUrl);

    return (
      <TouchableOpacity onPress={this._onPress} style={{height:height}}>
        {imgUrl.length > 0 ?
          <Image resizeMode={'contain'}
            onError={(e) => console.log(e.nativeEvent.error) }
            style={{flex:1, width:width, height:height, resizeMode:'contain', alignSelf: "center"}}
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

export default LocationLink;
