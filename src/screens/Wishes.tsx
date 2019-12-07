import * as React from "react";
import { connect } from 'react-redux';
import { StyleSheet, SectionList, Text, TouchableHighlight, Platform, TouchableOpacity, ActivityIndicator, ScrollView, View, Image  } from "react-native";
import colors from "../config/colors";
import strings from "../config/strings";
import Button from "../components/Button";
import Picker from "react-native-picker-select";
import WishItem from "../components/WishItem";
import CategoryIcon from "../components/CategoryIcon";
import Icon from "../components/Icon";
import {listData} from "../redux/listDataReducer";
import {updateLocation} from '../redux/authActions';
import Geolocation from '@react-native-community/geolocation';
import baseStyles from '../theme';

Geolocation.setRNConfiguration({
  skipPermissionRequests:true,
  authorizationLevel:"whenInUse"
});

const styles = Object.assign({...baseStyles}, StyleSheet.create({
  filters : {
     backgroundColor:colors.LIGHT_GREY,
     borderBottomWidth: StyleSheet.hairlineWidth,
     borderBottomColor: "rgba(000,000,000,1)",
     marginBottom:3,
     paddingHorizontal:6,
     paddingVertical:4,
  },
  gpsBtn : {
    width: 40,
    height: 40,
    marginRight:2,
    borderRadius: 4,
    justifyContent:'center',
    alignContent:'stretch',
    alignItems:'stretch',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(000,000,000,0.7)"
  },
  radius: {
    backgroundColor: colors.WHITE,
    borderRadius:8,
    marginRight:25,
    color:colors.BLACK,
    fontFamily:'Poppins-Medium',
  },
  sectionHeader: {
    paddingVertical:5,
    paddingHorizontal: 10,
    marginTop:0,
    marginBottom:0,
    fontSize: 14,
    fontWeight: 'bold',
    width:'100%',
    color:colors.LIGHT_GREEN,
    backgroundColor:colors.LIGHT_GREY,
  },
}));

interface State {
  radius:string;
  lonlat:string;
  categories:object
}

class Wishes extends React.Component<{}, State> {

  readonly state: State = {
    radius:24000,
    lonlat:'',
    categories:{},
    locationHelp:strings.LOCATION_PROMPT
  };

  componentDidMount() {
    console.log("WISHES DID MOUNT");
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
    }
    this.refresh();
  }

  componentWillUnmount() {
    console.log("WISHES WILL UNMOUNT");
  }

  refresh = ()  => {
    if (this.state.lonlat.length > 3) {
      var url = "/api/wishes/list?coords=" + this.state.lonlat + "&meters=" + this.state.radius;
//      if (Object.keys(this.state.categories).length > 0) {
        for (var g in this.state.categories) {
          url += '&category[]=' + g;
        }
//      }
      //console.warn(url);
      this.props.listData(url);
    } else {
      this.getCurrentPosition();
    }
  }

  getCurrentPosition = () => {
    var that = this;
    this.setState({locationHelp:strings.LOCATION_TESTING});
    Geolocation.getCurrentPosition(pos => {
      that.props.updateLocation(pos.coords);
      var lonlat = pos.coords.longitude + ',' + pos.coords.latitude;
      that.setState({lonlat:lonlat, locationHelp:strings.LOCATION_PROMPT}, () => {
        that.refresh();
      });
    },
    error => {
      that.setState({locationHelp:strings.LOCATION_PROMPT + ' \n ' + error.message});
    },
    {enableHighAccuracy: false, timeout:15000, maximumAge: 20000});
  }

  _radiusChanged = (itemValue, itemIndex) => {
    var that = this;
    this.setState({ radius: itemValue }, function(){
      that.refresh();
    });
  }

  _keyExtractor = (item, index) => item._id + '_' + index;

  toggleCat = (catId) => {
    var cats = {...this.state.categories};
    if (Object.keys(cats).length === this.props.catMap.length) {
      cats = {}; // === all selected
    } else if (typeof cats[catId] === 'string') {
      delete cats[catId];
    } else {
      // TODO: if Object.keys(cats).length === 0, then all ALL OTHERS
      cats[catId] = catId;
    }
    var that = this;
    //console.warn("UPDATING CATEGORIES " + catId, cats);
    this.setState({categories:cats}, e => {
      that.refresh();
    });
  }

  _renderSectionHead = ({section}) => {
    if (section.title === 'Nearby Wishes') {

      var radiusOpts = [{label: '.5 mile', value: 500}], i = 1;

      while(i < 6) {
        radiusOpts.push({label:i + ' miles', value:(i * 1000)});
        i++;
      };
      while(i < 24) {
        radiusOpts.push({label:i + ' miles', value:(i * 1000)});
        i += 2;
      };
      while(i < 50) {
        radiusOpts.push({label:i + ' miles', value:(i * 1000)});
        i += 5;
      };

      radiusOpts.push({label:'Anywhere', value:'anywhere'});

      return (
        <View>
          <Text style={styles.sectionHeader}>{section.title}</Text>
          <View style={[styles.row, styles.filters]}>
            <View style={styles.gpsBtn}>
              {(this.state.locationHelp === strings.LOCATION_TESTING || this.props.loading === true) ?
                <ActivityIndicator size='large'/>
                :
                <Icon
                  onPress={(e) => this.getCurrentPosition()}
                  style={{flex:1}}
                  icon={require('../assets/images/baseline_my_location_black_18dp.png')}
                  label={this.state.locationHelp}
                  />
              }
            </View>
            <Picker
              value={this.state.radius}
              style={styles.radius}
              useNativeAndroidPickerStyle={false}
              onValueChange={this._radiusChanged}
              items={radiusOpts} />
            {Object.entries(this.props.catMap).map( ([i, value]) => {
              return <CategoryIcon
                key={value._id}
                style={{marginRight:5}}
                disabled={(Object.keys(this.state.categories).length > 0 && typeof this.state.categories[value._id] === 'undefined')}
                name={value.name} id={value._id}
                onPress={this.toggleCat.bind(this, value._id)} />;
              })
            }
        </View>
      </View>)
    } else {
      return (<Text style={[styles.sectionHeader, {color:colors.SOFT_RED}]}>{section.title}</Text>);
    }
  }

  _renderItem = ({item}) => {
      if (typeof item.wish != 'undefined') {
        const { wish, ...offer } = item;
        return (<WishItem offer={offer} wish={wish} toggleCat={this.toggleCat} />)
      }
      return (<WishItem wish={item} toggleCat={this.toggleCat} />)
  };

  render() {
    if (this.state.lonlat === '') {
      return (<View style={styles.loading}><Button
        style={{backgroundColor:colors.SOFT_RED, alignSelf:'center'}}
        label={this.state.locationHelp}
        onPress={(e) => this.getCurrentPosition()} /></View>);
    }

    const allSections = [];
    if (this.props.offers && this.props.offers.length > 0) {
      allSections.push({title: strings.OFFERS_SECTION, data: this.props.offers});
    }
    if (this.props.wishes && this.props.wishes.results) {
      allSections.push({title: strings.WISHES_SECTION, data: this.props.wishes.results});
    }

    return (
      <ScrollView>
      {
        allSections.length > 0 ?
        <SectionList
          sections={allSections}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHead}
        />
        :
        (this.props.loading === false)
        ? <View style={styles.loading}><Text>No results</Text></View> : null
      }
      </ScrollView>
    );
  }
}

const mapDispatchToProps = {
  listData: (url) => listData(url),
  updateLocation: (coords) => updateLocation(coords)
}

const mapStateToProps = state => {
  var newProps = {wishes: state.lists.wishes, loading:state.lists.loading, catMap:state.auth.categories};
  if (state.lists.offers.length && state.lists.offers.results) {
    newProps.offers = state.lists.offers.results;
  } else {
    newProps.offers = state.auth.me.offers; // WARN: this is only valid on appstartup
  }
  return newProps;
}


export default connect(mapStateToProps, mapDispatchToProps)(Wishes)
