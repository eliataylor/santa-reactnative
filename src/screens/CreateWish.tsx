import React, { Component } from 'react';
import {
  Platform,
  Text,
  Alert,
  View,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

import { connect } from 'react-redux'
import strings from "../config/strings";
import colors from '../config/colors'
import { createWish } from '../redux/entityDataReducer'
import { updateLocation } from '../redux/authActions';
import Picker from "react-native-picker-select";
import Button from '../components/Button'
import FormTextInput from '../components/FormTextInput'
import LocationSelector from '../components/LocationSelector';
import styles from '../theme';

const { width, height } = Dimensions.get('window');

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
      <ScrollView>
      <View style={styles.container} >
        {(this.props.loading === true) ? <View style={styles.loading}><ActivityIndicator size='large' /></View> : null}
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
          <Picker
            style={{
              ...styles.picker,
              inputAndroid: {
                backgroundColor:colors.WHITE,
                color:colors.SILVER,
                fontFamily:'Poppins-ExtraBold',
                paddingVertical:10,
                paddingLeft:10,
                borderRadius:8,
                marginBottom:15,
                fontWeight: 'bold',
              },
              placeholder: {
                backgroundColor:colors.WHITE,
                color:colors.SILVER,
                fontFamily:'Poppins-ExtraBold',
                paddingVertical:10,
                paddingLeft:10,
                borderRadius:8,
                marginBottom:15,
                fontWeight: 'bold',
            }}}
            placeholder={{label:'Select a category', value:'', color:colors.SILVER}}
            selectedValue={this.state.category}
            onValueChange={(itemValue, itemIndex) => this.setState({ category: itemValue })}
            items={catOpts} />
          <View>
            <LocationSelector  onMarkerChange={this.onMarkerChange} onGpsLocation={this.props.updateLocation} />
          </View>
        </View>
        <Button label={'Create Wish'} onPress={this.submitWish.bind(this)} />
      </View>
      </ScrollView>
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
