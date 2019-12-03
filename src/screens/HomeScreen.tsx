import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import Button from '../components/Button';
import FormTextInput from "../components/FormTextInput";
import { connect } from 'react-redux';
import VerifyUser from "./VerifyUser";
const logo = require('../assets/images/logo.png');
const santaIcon = require('../assets/images/santa-panda.png');
const elfIcon = require('../assets/images/elf-panda.png');

const styles = StyleSheet.create({
  pageContainer: {
    alignItems: 'stretch',
    justifyContent: 'space-around',
    padding:10,
    backgroundColor:colors.WHITE,
    fontFamily:'Poppins-Regular'
  },
  roleBtn: {
    marginRight:10,
    marginLeft:10,
    marginBottom:3,

    paddingTop:20,
    paddingBottom:20,

    backgroundColor:colors.SILVER,
    borderRadius:10,
    borderWidth: 1,
    borderColor: colors.SILVER,
    width:'100%',
    fontSize:20,
  },
  header : {
    fontFamily:'Poppins-Bold',
    textAlign:'center',
    fontSize:22
  },
  subheader : {
    fontFamily:'Poppins-Regular',
    textAlign:'center',
    fontSize:18
  },
  logo : {
    width:'100%'
  },
  prompt : {
    fontFamily:'Poppins-Light',
    fontSize:14,
    color:colors.WHITE
  },
  infoBtn : {
    borderRadius:30,
    width:25,
    height:25,
    marginTop:0,
    backgroundColor:colors.LIGHT_GREY,
    color:colors.WHITE
  }
})

interface State {
  activeTab:string;
}

class HomeScreen extends React.Component<Props, State> {

  readonly state: State = {
    activeTab:''
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerTitle: <Image
        source={logo}
        style={{ width: 30, height: 30 }}
      />,
      headerLeft: (
        <Button
          onPress={() => navigation.navigate('Wishes')}
          title="Wishes"
        />
      ),
      headerRight: (
        <Button
          onPress={() => navigation.navigate('CreateWish')}
          title="Create A Wish"
        />
      ),
    };
  };

  setTab(tab) {
    this.setState({ activeTab: tab });
  };


  render() {
    if (this.props.me.isVerified ===false ) {
      return <VerifyUser />;
    }

    return (
      <View style={styles.pageContainer}>
        <Text style={styles.header}>{this.props.me.name.first ? 'Welcome ' + this.props.me.name.first : 'Hello there'}</Text>
        <Text style={styles.subheader}>Pick a role, do good, and earn your blessing</Text>

        <View style={{flexDirection:'row', alignItems: 'space-around', justifyContent:'space-around', width:'100%'}}>
          <View style={{flexDirection:'column', width:'50%', alignItems: 'center', justifyContent:'space-around' }}>
              <Image source={santaIcon}
                     style={styles.logo}
                     resizeMode="contain" />
              <Button
                style={[styles.roleBtn, this.state.activeTab === 'CreateWish' ? {backgroundColor:colors.SILVER} : {backgroundColor:colors.SOFT_RED}]}
                label={"Santa"}
                onPress={this.setTab.bind(this, 'Wishes')} />
              <View style={{alignItems: 'flex-start'}}>
                <Button
                  style={[styles.infoBtn, {alignSelf:'flex-start'}]}
                  label={"i"}
                  onPress={this.setTab.bind(this, 'Wishes')} />
                <Text style={[styles.prompt, this.state.activeTab === 'Wishes' ? {color:colors.DARK_GREY} : {color:colors.WHITE}]}>Choosing the Santa role allows you to view wishes near you and fulfill them.</Text>
              </View>
          </View>
          <View style={{flexDirection:'column', width:'50%', alignItems: 'center', justifyContent:'space-around' }}>
              <Image source={elfIcon}
                     style={styles.logo}
                     resizeMode="contain" />
              <Button
                style={[styles.roleBtn, this.state.activeTab === 'Wishes' ? {backgroundColor:colors.SILVER} : {backgroundColor:colors.LIGHT_GREEN}]}
                label={"Elf"}
                onPress={this.setTab.bind(this, 'CreateWish')} />
              <View style={{alignItems: 'flex-end'}}>
                <Button
                  style={[styles.infoBtn, {textAlign:'right'}]}
                  label={"i"}
                  onPress={this.setTab.bind(this, 'CreateWish')}  />
                <Text style={[styles.prompt, this.state.activeTab === 'CreateWish' ? {color:colors.DARK_GREY} : {color:colors.WHITE}]}>Choosing the Elf role allows you to submit a wish request for the homeless.</Text>
              </View>
          </View>
        </View>

        <View>
          <Button
            label={"Next"}
            style={{width:'auto', marginTop:10, backgroundColor:colors.DARK_GREY}}
            disabled={this.state.activeTab === ''}
            onPress={() => {this.props.navigation.navigate(this.state.activeTab)}}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  me: state.auth.me
});
export default connect(mapStateToProps, null)(HomeScreen);
