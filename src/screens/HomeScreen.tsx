import React from 'react';
import { Button, Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  pageContainer: { flex: 1, alignItems: 'stretch', justifyContent: 'space-around', padding:10 },
  roleBtn: {
    marginRight:10,
    marginLeft:10,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:colors.SILVER,
    borderRadius:10,
    borderWidth: 1,
    borderColor: colors.SILVER,
    width:'40%',
  },
  btnEnabled: {
    opacity: 1,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText : {
    textAlign:'center'
  }
})

interface State {
  activeTab:string;
}

export default class HomeScreen extends React.Component<{}, State> {

  readonly state: State = {
    activeTab:''
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerTitle: <Image
        source={require('../assets/images/logo.png')}
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

  setTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  render() {

    /* const  elfBtnStyles = [
      styles.roleBtn,
      (this.state.activeTab === 'Wishes') ? styles.btnDisabled : styles.btnEnabled
    ]
    const santaBtnStyles = [
      styles.roleBtn,
      (this.state.activeTab === 'CreateWish') ? styles.btnDisabled : styles.btnEnabled
    ];  */

    return (
      <View style={styles.pageContainer}>
        <Text>Hello there. Pick a role, do good, and earn your blessing</Text>

        <View style={{ flexDirection:'row', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            style={styles.roleBtn}
            onPress={this.setTab.bind(this, 'Wishes')}
            >
            <Text style={styles.btnText}>{"Santa"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roleBtn}
            onPress={this.setTab.bind(this, 'CreateWish')}
            >
            <Text style={styles.btnText}>{"Elf"}</Text>
          </TouchableOpacity>

        </View>
        {this.state.activeTab === 'Wishes' ?
          <Text>Click next and search nearby wishes to fulfill</Text>
        :
        this.state.activeTab == 'CreateWish' ?
          <Text>Click next and create a wish for the homeless</Text>
        :
        null
        }
        <Button
          title="Next"
          color={colors.TORCH_RED}
          disabled={this.state.activeTab === ''}
          onPress={() => {this.props.navigation.navigate(this.state.activeTab);}}
        />
      </View>
    );
  }
}
