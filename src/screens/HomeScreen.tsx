import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import Button from '../components/Button';
import FormTextInput from "../components/FormTextInput";
import { connect } from 'react-redux';
import VerifyUser from "./VerifyUser";
const santaIcon = require('../assets/images/santa-panda.png');
const elfIcon = require('../assets/images/elf-panda.png');
import styles from '../theme';

interface State {
  activeTab:string;
}

class HomeScreen extends React.Component<Props, State> {

  readonly state: State = {
    activeTab:''
  };

  setTab(tab) {
    this.setState({ activeTab: tab });
  };

  render() {
    if (this.props.me.isVerified ===false ) {
      return <VerifyUser />;
    }

    return (
      <View style={[styles.container, {paddingVertical:20, paddingHorizontal:10}]}>
        <Text style={styles.header}>{this.props.me.name.first ? 'Welcome ' + this.props.me.name.first : 'Hello there'}</Text>
        <Text style={styles.subheader}>Pick a role, do good, and earn your blessing</Text>
        <View style={styles.row}>
          <View style={styles.col}>
              <Image source={santaIcon}
                     style={styles.logo}
                     resizeMode="contain" />
              <Button
                style={{fontSize:22, paddingVertical:10, backgroundColor: this.state.activeTab === 'CreateWish' ? colors.SILVER : colors.SOFT_RED}}
                label={"Santa"}
                onPress={this.setTab.bind(this, 'Wishes')} />
              <Text style={[styles.prompt, this.state.activeTab === 'Wishes' ? {color:colors.DARK_GREY} : {color:colors.ALMOST_WHITE}]}>Choosing the Santa role allows you to view wishes near you and fulfill them.</Text>
          </View>
          <View style={styles.col}>
              <Image source={elfIcon}
                     style={styles.logo}
                     resizeMode="contain" />
              <Button
              style={{fontSize:22, paddingVertical:10, backgroundColor: this.state.activeTab === 'Wishes' ? colors.SILVER : colors.LIGHT_GREEN}}
                label={"Elf"}
                onPress={this.setTab.bind(this, 'CreateWish')} />
              <Text style={[styles.prompt, this.state.activeTab === 'CreateWish' ? {color:colors.DARK_GREY} : {color:colors.ALMOST_WHITE}]}>Choosing the Elf role allows you to submit a wish request for the homeless.</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Button
            label={"Next"}
            style={{flex:1, marginTop:10, backgroundColor:colors.DARK_GREY}}
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
