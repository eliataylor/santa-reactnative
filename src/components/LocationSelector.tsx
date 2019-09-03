import React from 'react';
import { StyleSheet, View, Text, Button, Dimensions, Platform } from 'react-native';

import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import colors from "../config/colors";

Geolocation.setRNConfiguration({
  skipPermissionRequests:true,
  authorizationLevel:"whenInUse"
});

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

class LocationSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      loc: ''
    };

    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
    }
    this.getCurrentPosition();
  }

  getCurrentPosition() {
    var that = this;

    Geolocation.getCurrentPosition(pos => {
      console.log('GOT POSITION', pos);
      var coor = {latitude:pos.coords.latitude, longitude:pos.coords.longitude};
      that.setState({loc:coor});
      that.props.onGpsLocation(pos.coords);
      that.props.onMarkerChange(coor); // send back to parent in case it's the current location
    },
    error => {
      that.setState({loc:JSON.stringify(error)});
    },
    {enableHighAccuracy:false, timeout: 20000, maximumAge: 1000});
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
          <Button title={'Enable your Location'} onPress={(e) => this.getCurrentPosition()} />
          <Text>{this.state.loc}</Text>
        </View>
        )
    }

    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          showsMyLocationButton={true}
          showsTraffic={false}
          showsIndoors={false}
          onLongPress={this.onSelect}
          showsUserLocation={false}
          showsMyLocationButton={true}
          initialRegion={this.state.region}
        >
          <Marker
            draggable
            coordinate={this.state.loc}
             onSelect={this.onSelect}
            onDragEnd={this.onSelect}
            >
          </Marker>
        </MapView>
        <Text styles={styles.help}>Press and hold the location of this Wish</Text>
      </View>
    );
  }
}

LocationSelector.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  help: {
    fontSize:10,
    color:colors.SILVER,
    textAlign:'right'
  }
});

export default LocationSelector;
