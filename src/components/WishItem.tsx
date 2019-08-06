import * as React from "react";
import { connect } from 'react-redux';
import { StyleSheet, View, Text, Alert } from "react-native";
import colors from "../config/colors";
import strings from "../config/strings";
import Button from "./Button";
import CategoryIcon from "./CategoryIcon";
import LocationLink from "./LocationLink";
import moment from "moment";

export default class WishItem extends React.PureComponent {

  fulfillWish() {
    Alert.alert(
      strings.FULFILL,
      'Are you sure you can deliver this wish within 90 minutes?',
      [
        {text: 'Yes', onPress: () => console.log('Ask me later pressed')},
        {text: 'No', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

  render() {
    const textColor = this.props.selected ? 'red' : 'black';
    return (
        <View style={styles.container}>
          <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
            <CategoryIcon id={this.props.category} />
            <Text style={{color: textColor}}>{moment(this.props.createdAt).format('MMM Do h:mma')}</Text>
          </View>
          <View style={{width:'100%', height:150, flexDirection:'row', flexWrap:'nowrap', justifyContent:'space-between', alignItems:'flex-start', alignContent:'flex-start'}}>
            <View style={{width:'49%', alignSelf:'flex-start'}}>
              <Text style={styles.h1}>{this.props.title}</Text>
              <Text style={styles.body}>{this.props.body}</Text>
              <Button style={{marginTop:10}}
                      label={strings.FULFILL}
                      onPress={(e) => this.fulfillWish(e)} />
            </View>
            <View style={{width:'49%', alignSelf:'flex-start'}}><LocationLink {...this.props.location} /></View>
          </View>
        </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    marginTop:10,
    marginBottom:10
  },
  h1: {
    fontWeight: 'bold',
    fontSize:18,
  },
  body: {
    fontWeight:'normal',
    fontSize:14
  },
});
