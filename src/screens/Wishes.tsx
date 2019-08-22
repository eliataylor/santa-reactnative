import * as React from "react";
import { connect } from 'react-redux';
import { StyleSheet, Button, SectionList, Text, TouchableHighlight,  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, View, Image, SafeAreaView, Alert  } from "react-native";
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
     backgroundColor:colors.LIGHT_GREY,
     borderBottomWidth: StyleSheet.hairlineWidth,
     borderBottomColor: "rgba(000,000,000,0.5)",
     width: '100%',
     marginTop:0,
     marginBottom:0,
     paddingHorizontal:4,
     paddingBottom:5,
  },
  content : {
    marginTop:0,
    paddingLeft:5,
    paddingRight:12
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
    alignSelf: "center"
  },
  sectionHeader: {
    paddingVertical:5,
    paddingHorizontal: 10,
    marginTop:0,
    marginBottom:0,
    fontSize: 14,
    fontWeight: 'bold',
    color:colors.LIGHT_GREEN,
    backgroundColor:colors.LIGHT_GREY,
  },
  loading : {
    position: 'absolute',
   left: 0,
   right: 0,
   top: 0,
   bottom: 0,
   opacity: 0.5,
   width:'100%',
   height:'100%',
   backgroundColor: 'rgba(0,0,0,.5)',
   justifyContent: 'center',
   alignItems: 'center'
  }
});

interface State {
  radius:string;
  lonlat:string;
  categories:object
}

class Wishes extends React.Component<{}, State> {

  readonly state: State = {
    radius:25000,
    lonlat:'',
    categories:{},
    locationHelp:'GPS Location of this wish'
  };

  componentDidMount() {
    //Geolocation.requestAuthorization();
    this.refresh();
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
    that.setState({locationHelp:'Loading your GPS location...'});
    Geolocation.getCurrentPosition(pos => {
      var lonlat = pos.coords.longitude + ',' + pos.coords.latitude;
      that.setState({lonlat:lonlat}, () => {
        that.refresh();
        that.setState({locationHelp:'GPS Location of this wish'});
      });
    },
    error => {
      that.setState({locationHelp:'Please enabled GPS Location in your settings'});
      Alert.alert('Error', error.message)
    },
    {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000});
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

      while(i < 50){
        radiusOpts.push({label:i + ' miles', value:(i * 1000)});
        i++;
      };

      return (
        <View>
        <Text style={styles.sectionHeader}>{section.title}</Text>
        <View style={styles.filters}>
        <View style={styles.iconBtn}>
          {(this.state.locationHelp === 'Loading your GPS location...') ?
            <ActivityIndicator size='large'/>
            :
            <TouchableHighlight
              style={styles.icon}
              onPress={(e) => this.getCurrentPosition()}
              ><Image
              source={require('../assets/images/gpsicon.png')}
              resizeMode={'contain'}
              style={styles.icon}
              onError={(e) => console.log(e.nativeEvent.error) }
              accessibilityLabel={'gps refresh'} /></TouchableHighlight>
          }
        </View>
        <Picker
          value={this.state.radius}
          useNativeAndroidPickerStyle={false}
          onValueChange={this._radiusChanged}
          items={radiusOpts} />
        {Object.entries(this.props.catMap).map( ([i, value]) => {
          return <CategoryIcon
            key={value._id}
            disabled={(Object.keys(this.state.categories).length > 0 && typeof this.state.categories[value._id] === 'undefined')}
            name={value.name} id={value._id}
            onPress={this.toggleCat.bind(this, value._id)} />;
          })
        }
      </View></View>)
    } else {
      return (<Text style={[styles.sectionHeader, {color:colors.TORCH_RED}]}>{section.title}</Text>);
    }
  }

  _renderItem = ({item}) => {
      if (typeof item.wish != 'undefined') {
        const { wish, ...offer } = item;
        return (<WishItem offer={offer} wish={wish} />)
      }
      return (<WishItem wish={item} />)
  };

  render() {
    if (this.state.lonlat === '') {
      if (this.state.locationHelp === 'Loading your GPS location...') {
        return (<View style={styles.loading}>
          <Text>{this.state.locationHelp}</Text>
          <ActivityIndicator size='large'/>
        </View>);
      }
      return (<View style={styles.container}><Button title={strings.LOCATION_PROMPT} onPress={(e) => this.getCurrentPosition()} /></View>);
    }

    const allSections = [];
    if (this.props.offers && this.props.offers.length > 0) {
      allSections.push({title: strings.OFFERS_SECTION, data: this.props.offers});
    }
    if (this.props.wishes && this.props.wishes.results) {
      allSections.push({title: strings.WISHES_SECTION, data: this.props.wishes.results});
    }

    return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={{width:'100%', paddingLeft:30}}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')} >
            <Image source={require('../assets/images/baseline_undo_black_18dp.png')}  />
          </TouchableOpacity>
        </View>
        { (this.props.loading === true) ? <View style={styles.loading}><ActivityIndicator size='large'/></View> : null }
      {
        allSections.length > 0 ?
        <SectionList
                  sections={allSections}
                  style={styles.content}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderItem}
                  renderSectionHeader={this._renderSectionHead}
                />
                :
                <Text>No results</Text>
      }
      </KeyboardAvoidingView>
    );
  }
}

const mapDispatchToProps = {
  listData: (url) => listData(url)
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
