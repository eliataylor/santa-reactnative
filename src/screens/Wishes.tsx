import * as React from "react";
import { connect } from 'react-redux';
import { StyleSheet, FlatList, Text, KeyboardAvoidingView } from "react-native";
import Button from "../components/Button"
import colors from "../config/colors";
import strings from "../config/strings";
import WishItem from "../components/WishItem";
import {listData} from "../redux/listDataReducer";
import Geolocation from '@react-native-community/geolocation';

Geolocation.setRNConfiguration({
  skipPermissionRequests:true,
  authorizationLevel:"whenInUse"
});


const styles = StyleSheet.create({
  container: {
    paddingTop:20,
    paddingLeft:5,
    paddingRight:5
  }
});

interface State {
  selected: boolean;
  radius:string;
  latlon:string;
  categories:object
}

class Wishes extends React.Component<{}, State> {

  readonly state: State = {
    selected: false,
    radius:5000,
    latlon:'',
    categories:[]
  };

  componentDidMount() {
    console.log('wishes DID MOUNT');
    Geolocation.requestAuthorization();
    this.refresh();
  }

  refresh = ()  => {
    if (this.state.latlon.length > 3) {
      var url = "/api/wishes/list?coords=" + this.state.latlon + "&meters=" + this.state.radius;
      if (this.state.categories.length > 0) {
        url += '&category=' + this.state.categories.join(',');
      }
      this.props.listData(url);
    } else {
      this.getCurrentPosition();
    }
  }

  getCurrentPosition = () => {
    Geolocation.getCurrentPosition(pos => {
      var latlon = pos.coords.longitude + ',' + pos.coords.latitude;
      this.setState({latlon:latlon}, () => {
        this.refresh();
      });
    },
    error => Alert.alert('Error', JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
  }

  _keyExtractor = (item, index) => item._id;

  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    console.log('wish ' + id + ' pressed');
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
  };

  _renderItem = ({item}) => (
    <WishItem
      // onPressItem={this._onPressItem}
      {...item}
    />
  );

  render() {
    if (this.state.latlon === '') {
      return <Button label={strings.LOCATION_PROMPT} onPress={this.getCurrentPosition()} />;
    }
    if (!this.props.lists.apiData || typeof this.props.lists.apiData.results !== 'object')
      return <Text>No wishes with your filters</Text>;

    return (
      <KeyboardAvoidingView style={styles.container}>
      <FlatList
        data={this.props.lists.apiData.results}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
      </KeyboardAvoidingView>
    );
  }
}

const mapDispatchToProps = {
  listData: (url) => listData(url)
}

const mapStateToProps = state => ({
  lists: state.lists
})

export default connect(mapStateToProps, mapDispatchToProps)(Wishes)
