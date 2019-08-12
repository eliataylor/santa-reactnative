import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  Button,
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

import Input from '../components/FormTextInput'


const styles = StyleSheet.create({
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
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
}

class CreateWish extends React.Component<{}, State> {
  readonly state: State = {
    title: '',
    desc: '',
    category: '',
    encampment: ''
  };

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  submitWish() {
    this.props.createWish(this.state.title, this.state.desc, this.state.category, this.state.encampment);
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
            onChangeText={this.onChangeText}
            value={this.state.title}
          />
          <Input
            placeholder="Optional Description"
            type='text'
            onChangeText={this.onChangeText}
            value={this.state.desc}
          />
          <Picker
            placeholder={{label:'Select a category', value:''}}
            selectedValue={this.state.category}
            onValueChange={(itemValue, itemIndex) => this.setState({ category: itemValue })}
            items={catOpts} />
          <Input
            placeholder="Encampment"
            type='text'
            style={{display:'none'}}
            onChangeText={this.onChangeText}
            value={this.state.encampment}
          />
        </View>
        <Button
          title={'Create Wish'}
          onPress={this.submitWish.bind(this)}
        />
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  auth: {...state.auth}
})

const mapDispatchToProps = {
  submitWish: (title,desc,category,encampment) => createWish(title,desc,category,encampment)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateWish)
