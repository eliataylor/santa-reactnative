import React from 'react';
import { StyleSheet, View, Text, Dimensions, Platform } from 'react-native';

import Button from './Button';
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import colors from "../config/colors";

Geolocation.setRNConfiguration({
  skipPermissionRequests:true,
  authorizationLevel:"whenInUse"
});

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class LocationSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loc: ''
    };

    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
    console.log("LocationSelector DIDMOUNT");
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
    }
    this.getCurrentPosition();
  }

  getCurrentPosition() {
    var that = this;

    console.log("LocationSelector requesting Location");
    Geolocation.getCurrentPosition(pos => {
      console.log('GOT POSITION', pos);
      var coords = {latitude:pos.coords.latitude, longitude:pos.coords.longitude};
      that.setState({loc:coords}, () => {
        that.props.onMarkerChange(coords); // send back to parent form
        that.props.onGpsLocation(coords); // send back to connected parent as current location for server update
      });
    },
    error => {
      console.warn(error);
      if (error.message) {
        that.setState({loc:error.message});
      } else {
        that.setState({loc:JSON.stringify(error)});
      }
    },
    {enableHighAccuracy:false, timeout:15000, maximumAge: 20000});
  }

  onSelect(e) {
    var coor = e.nativeEvent;
    console.log('onSelect', coor);
    if (typeof coor.coordinate === 'object' && typeof coor.coordinate.longitude === 'number') {
      this.setState({loc:coor.coordinate});
      this.props.onMarkerChange(coor.coordinate);
    }
  }

  render() {
    if (this.state.loc === '') {
      return (<Text>Checking your location</Text>);
    }
    if (typeof this.state.loc === 'string') {
      return (
        <View style={styles.container}>
          <Button label={'Try Location Again'} onPress={(e) => this.getCurrentPosition()} />
          <Text >{this.state.loc}</Text>
        </View>
        )
    }

    return (
      <View style={styles.mapBox}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          showsMyLocationButton={true}
          showsTraffic={false}
          showsIndoors={false}
          onLongPress={this.onSelect}
          showsUserLocation={false}
          showsMyLocationButton={true}
          initialRegion={{
            latitude: this.state.loc.latitude,
            longitude: this.state.loc.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
        >
          <Marker
            draggable
            coordinate={this.state.loc}
            onSelect={this.onSelect}
            onDragEnd={this.onSelect}
            >
          </Marker>
        </MapView>
        <Text styles={styles.help}>Press and hold the location of where this wish should be delivered.</Text>
      </View>
    );
  }
}

LocationSelector.propTypes = {
  provider: ProviderPropType
};

const styles = StyleSheet.create({
  mapBox: {
    width:width-20,
    height:height/2
  },
  map: {
    flex:1,
    position:'relative',
    width:width-20,
    height:(height/2),
    marginVertical:10
  },
  help: {
    fontSize:12,
    width:'100%',
    fontFamily:'Poppins-Medium',
    color:colors.BLACK,
    textAlign:'center'
  }
});

export default LocationSelector;
