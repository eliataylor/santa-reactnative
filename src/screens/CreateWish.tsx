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
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import { connect } from 'react-redux'
import strings from "../config/strings";
import { colors } from '../theme'
import { createWish } from '../redux/entityDataReducer'
import { updateLocation } from '../redux/authActions';
import Picker from "react-native-picker-select";
import FormTextInput from '../components/FormTextInput'
import LocationSelector from '../components/LocationSelector';

const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    paddingHorizontal: 40,
    paddingVertical:50
  },
  form: {
    flex: 1,
    justifyContent: "center",
  },
  map: {
    flex:1,
    position:'relative',
    width:(width - 30),
    height: (height/3),
    marginVertical:10
  },
  errorMessage: {
    // fontFamily: fonts.base,
    fontSize: 12,
    marginTop: 10,
    color: 'transparent'
  },
  textInput: {
    height: 40,
    borderColor: colors.SILVER,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20
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
    lonlat: ''
  };

  constructor(props) {
    super(props);
    this.onMarkerChange = this.onMarkerChange.bind(this);
  }

  onChangeTitle = (value: string) => {
    this.setState({title: value})
  }
  onChangeDesc = (value: string) => {
    this.setState({desc: value})
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
      console.log('you must enable your location');
    }
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

  onMarkerChange(coords) {
    console.log("ON MARKER CHANGE", coords);
    var lonlat = coords.longitude + ',' + coords.latitude;
    this.setState({lonlat:lonlat});
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
    if (this.props.auth.categories) {
      for(var i=0; i < this.props.auth.categories.length; i++){
        catOpts.push({label:this.props.auth.categories[i].name, value:this.props.auth.categories[i]._id});
      };
    }

    return (
      <View
        style={styles.container}
        behavior="padding"
      >
        {(this.props.loading === true) ? <View style={styles.loading}><ActivityIndicator size='large' /></View> : null}
        <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')}>
          <Image source={require('../assets/images/baseline_undo_black_18dp.png')}  />
        </TouchableOpacity>
        <View style={styles.form}>
          <FormTextInput
            placeholder="Wish Title"
            type='text'
            returnKeyType='next'
            autoCorrect={true}
            onChangeText={this.onChangeTitle}
            value={this.state.title}
            keyboardType='default'
          />
          <FormTextInput
            placeholder="Optional Description"
            type='text'
            returnKeyType='next'
            keyboardType='default'
            onChangeText={this.onChangeDesc}
            value={this.state.desc}
          />
          <View style={{  marginBottom: 10, position:'relative'}}>
            <Picker
              style={styles.textInput}
              placeholder={{label:'Select a category', value:''}}
              selectedValue={this.state.category}
              onValueChange={(itemValue, itemIndex) => this.setState({ category: itemValue })}
              items={catOpts} />
          </View>
          <View style={styles.map}>
            <LocationSelector  onMarkerChange={this.onMarkerChange} onGpsLocation={this.props.updateLocation} />
          </View>
          <View style={{marginTop:40}}>
            <Button
              style={{backgroundColor:colors.LIGHT_GREEN}}
              title={'Create Wish'}
              onPress={this.submitWish.bind(this)}
            />
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = function(state){
  var newProps = {};
  newProps.auth = {...state.auth};
  newProps.entity = {...state.entity};
  newProps.loading = state.entity.loading;
  return newProps;
}

const mapDispatchToProps = {
  createWish: (item) => createWish(item),
  updateLocation : (coords) => updateLocation(coords)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateWish)
