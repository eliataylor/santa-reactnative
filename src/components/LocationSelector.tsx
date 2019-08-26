import React from 'react';
import { StyleSheet, View, Text, Button, Dimensions, Platform } from 'react-native';

import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

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
      loc: false
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
      that.setState({loc:pos.coords});
      that.props.onMarkerChange(pos.coords); // send back to parent in case it's the current location
    },
    error => Alert.alert('Error', JSON.stringify(error)),
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

    if (this.state.loc === false) {
      return (<Button title={'Enable your Location'} onPress={(e) => this.getCurrentPosition()} />)
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
          // onRegionChange={this.onRegionChange}
        >
          <Marker
            draggable
            coordinate={this.state.loc}
             onSelect={this.onSelect}
            onDragEnd={this.onSelect}
            >
          </Marker>
        </MapView>
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
});

export default LocationSelector;
