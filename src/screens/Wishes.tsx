import * as React from "react";
import { connect } from 'react-redux';
import { StyleSheet, FlatList, Text, KeyboardAvoidingView, View, Image, SafeAreaView, Alert  } from "react-native";
import Button from "../components/Button"
import colors from "../config/colors";
import strings from "../config/strings";
import Picker from "react-native-picker-select";
import WishItem from "../components/WishItem";
import CategoryIcon from "../components/CategoryIcon";
import {listData} from "../redux/listDataReducer";
import Geolocation from '@react-native-community/geolocation';

Geolocation.setRNConfiguration({
  skipPermissionRequests:true,
  authorizationLevel:"whenInUse"
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filters : {
     flex: 1,
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     width: '100%',
     flexWrap: 'nowrap',
     marginBottom: 10,
     padding:8,
     maxHeight:80
  },
  content : {
    marginTop:20,
    paddingLeft:5,
    paddingRight:5
  },
  iconBtn : {
    width: 40,
    height: 40,
    margin:4,
    padding:3,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(000,000,000,0.7)"
  },
  icon: {
    flex: 1,
    width: "100%",
    height:"100%",
    resizeMode: "contain",
    alignSelf: "center"
  },
});

interface State {
  selected: boolean;
  radius:string;
  latlon:string;
  categories:object
}

const catMap = {
  '5d34461c274db5adac4a8d39' : 'Academics',
  '5d34461c274db5adac4a8d38' : 'Arts',
  '5d34461c274db5adac4a8d36' : 'Clothes',
  '5d34461c274db5adac4a8d37' : 'First Aid',
  '5d34461c274db5adac4a8d35' : 'Food'
}

class Wishes extends React.Component<{}, State> {

  readonly state: State = {
    selected: false,
    radius:5000,
    latlon:'',
    categories:{...catMap}
  };


  componentDidMount() {
    console.log('wishes DID MOUNT');
    Geolocation.requestAuthorization();
    this.refresh();
  }

  refresh = ()  => {
    if (this.state.latlon.length > 3) {
      var url = "/api/wishes/list?coords=" + this.state.latlon + "&meters=" + this.state.radius;
      if (Object.keys(catMap).length !== Object.keys(this.state.categories).length) {
        for (var g in this.state.categories) {
          url += '&category[]=' + g;
        }
      }
      this.props.listData(url);
    } else {
      this.getCurrentPosition();
    }
  }

  getCurrentPosition = () => {
    console.log('new geo position requested');
    var that = this;
    Geolocation.getCurrentPosition(pos => {
      var latlon = pos.coords.longitude + ',' + pos.coords.latitude;
      that.setState({latlon:latlon}, () => {
        that.refresh();
      });
    },
    error => Alert.alert('Error', JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
  }

  _keyExtractor = (item, index) => item._id;

  toggleCat = (catId) => {
    var cats = {...this.state.categories};
    const emptyObject = (Object.keys(cats).length === 0 && cats.constructor === Object);
    if (emptyObject) {
      cats = {...catMap}; // none selected === all selected
    } else if (typeof cats[catId] === 'string') {
      delete cats[catId];
    } else {
      cats[catId] = catMap[catId];
    }
    var that = this;
    console.log("UPDATING CATEGORIES", cats)
    this.setState({categories:cats}, e => {
      // that.refresh();
    });
  }

  _renderItem = ({item}) => (
    <WishItem
      {...item}
    />
  );

  render() {
    if (this.state.latlon === '') {
      return <Button label={strings.LOCATION_PROMPT} onPress={(e) => this.getCurrentPosition()} />;
    }
    if (!this.props.lists.apiData || typeof this.props.lists.apiData.results !== 'object') return <Text>Invalid request</Text>;

    var radiusOpts = [{label: '.5 mile', value: 500}], i = 1;

    while(i < 50){
      radiusOpts.push({label:i + ' miles', value:(i * 1000)});
      i++;
    };

    return (
      <KeyboardAvoidingView style={styles.container}>
      <SafeAreaView style={{backgroundColor:colors.LIGHT_GREEN}}>
          <View style={styles.filters}>
            <View style={styles.iconBtn}>
              <Image
                source={require('../assets/images/gpsicon.png')}
                onPress={(e) => this.getCurrentPosition()}
                resizeMode={'contain'}
                style={styles.icon}
                onError={(e) => console.log(e.nativeEvent.error) }
                accessibilityLabel={'gps refresh'} />
            </View>
            <View>
              <Picker
                value={this.state.radius}
                onValueChange={(itemValue, itemIndex) => this.setState({ radius: itemValue })}
                items={radiusOpts} />
            </View>
            {Object.entries(catMap).map( ([key, value]) => {
              var isDisabled = typeof this.state.categories[key] === 'undefined';
              console.log(value + ' DISABLED ' + isDisabled);
              return <CategoryIcon
                key={key}
                disabled={isDisabled}
                name={value} id={key}
                onPress={this.toggleCat.bind(this, key)} />;
              })
            }
          </View>
      </SafeAreaView>
  {this.props.lists.apiData.results.length === 0 ?
        <View><Text>No results</Text></View>
        :
        <FlatList
          style={styles.content}
          data={this.props.lists.apiData.results}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
        }
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
