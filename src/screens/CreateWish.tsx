import React, { Component } from 'react';
import {
  Platform,
  Text,
  Button,
  Alert,
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

import { connect } from 'react-redux'
import strings from "../config/strings";
import { colors } from '../theme'
import { createWish } from '../redux/entityDataReducer'
import Picker from "react-native-picker-select";
import Geolocation from '@react-native-community/geolocation';
import Input from '../components/FormTextInput'


Geolocation.setRNConfiguration({
  skipPermissionRequests:true,
  authorizationLevel:"whenInUse"
});

const styles = StyleSheet.create({
  form: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical:50
  },
  errorMessage: {
    // fontFamily: fonts.base,
    fontSize: 12,
    marginTop: 10,
    color: 'transparent'
  }
});

const catMap = {
  '5d34461c274db5adac4a8d39' : 'Academics',
  '5d34461c274db5adac4a8d38' : 'Arts',
  '5d34461c274db5adac4a8d36' : 'Clothes',
  '5d34461c274db5adac4a8d37' : 'First Aid',
  '5d34461c274db5adac4a8d35' : 'Food'
}

interface State {
  title: string;
  desc: string;
  category: string;
  encampment: string;
  lonlat:string;
}


class CreateWish extends React.Component {
  readonly state: State = {
    title: '',
    desc: '',
    category: '',
    encampment: '',
    lonlat: '',
  };

  onChangeTitle = (value) => {
    this.setState({title: value})
  }
  onChangeDesc = (value) => {
    this.setState({desc: value})
  }

  getCurrentPosition = () => {
    var that = this;
    Geolocation.getCurrentPosition(pos => {
      var lonlat = pos.coords.longitude + ',' + pos.coords.latitude;
      that.setState({lonlat:lonlat}, () => {
        // render streetview?
      });
    },
    error => Alert.alert('Error', JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
  }

  submitWish() {
    if (this.state.title.length < 3) {
      return Alert.alert('Error', 'You must provide a title');
    }
    if (this.state.category.length < 3) {
      return Alert.alert('Error', 'You must provide a category');
    }
    if (this.state.lonlat.length > 3) {
      var item = {
        title:this.state.title,
        body:this.state.desc,
        category:this.state.category,
        lonlat:this.state.lonlat
      };
      this.props.createWish(item);
    } else {
      this.getCurrentPosition();
    }
  }

  componentDidMount() {
    Geolocation.requestAuthorization();
    this.getCurrentPosition();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.entity.errors && nextProps.entity.apiData.title === this.state.title && this.state.title != '') { // WARN: a safe assumption, but not ideal key
      this.props.navigation.navigate('Wishes');
      return false;
    }
    if (JSON.stringify(nextProps.entity) !== JSON.stringify(this.props.entity)) {
      return true;
    }
    if (JSON.stringify(nextState) !== JSON.stringify(this.state)) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.entity.errors && prevProps.entity.apiData.title === this.state.title && this.state.title != '') { // WARN: a safe assumption, but not ideal key
      console.log("componentDidUpdate1", prevProps.entity, this.state);
      this.props.navigation.navigate('Wishes');
      this.setState({title: '',desc: '',category: '',encampment: '',lonlat: '',}); // reset form
    }
  }

  render() {
    const { signUpError, nextSteps } = this.props
    const catOpts = [];
    for(var i in catMap){
      catOpts.push({label:catMap[i], value:i});
    };

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
        <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')}>
          <Image source={require('../assets/images/baseline_undo_black_18dp.png')}  />
        </TouchableOpacity>
        <View style={styles.form}>
          <Input
            placeholder="Wish Title"
            type='text'
            onChangeText={this.onChangeTitle}
            value={this.state.title}
          />
          <Input
            placeholder="Optional Description"
            type='text'
            onChangeText={this.onChangeDesc}
            value={this.state.desc}
          />
          <Picker
            placeholder={{label:'Select a category', value:''}}
            selectedValue={this.state.category}
            style={{borderColor: colors.SILVER,borderBottomWidth: StyleSheet.hairlineWidth}}
            onValueChange={(itemValue, itemIndex) => this.setState({ category: itemValue })}
            items={catOpts} />
          <View style={{flexDirection:'row', marginTop:30, alignItems:'center'}}>
            <Image
              source={require('../assets/images/gpsicon.png')}
              onPress={(e) => this.getCurrentPosition()}
              resizeMode={'contain'}
              style={{width:30, height:30, marginRight:15}}
              onError={(e) => console.log(e.nativeEvent.error) }
              accessibilityLabel={'gps refresh'} />
              <Input
                placeholder="Location"
                help='GPS Location of this wish'
                type='text'
                style={{color:colors.SILVER}}
                color={colors.SILVER}
                value={this.state.lonlat}
              />
          </View>
          <View style={{marginTop:40}}>
            <Button
              style={{backgroundColor:colors.LIGHT_GREEN}}
              title={'Create Wish'}
              onPress={this.submitWish.bind(this)}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = function(state){
  var newProps = {};
  newProps.auth = {...state.auth};
  newProps.entity = {...state.entity};
  return newProps;
}

const mapDispatchToProps = {
  createWish: (item) => createWish(item)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateWish)
