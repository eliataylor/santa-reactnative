import * as React from "react";
import { connect } from 'react-redux';
import { StyleSheet, View, Text } from "react-native";
import colors from "../config/colors";
import strings from "../config/strings";

import CategoryIcon from "./CategoryIcon";
import LocationLink from "./LocationLink";
import moment from "moment";

/*
title: { type: String, required: true, initial:true },
body: { type: String, initial:true },
location: { type: Types.Location, initial:true, required:true },
encampment: { type: Types.Relationship, ref: 'Encampments', index: true, },
state: { type: Types.Select, options: 'draft, deleted, published, inprogress, fulfilled', default: 'draft', index: true },
category: { type: Types.Relationship, ref: 'Categories', required:true, index: true, initial:true},
elf: { type: Types.Relationship, ref: 'Users', required:true, initial:true, filters : { permission: 'isVerified' }   }, // aka author
createdAt: { type: Types.Date, default: Date.now },
lastUpdated:{ type: Types.Date, default: Date.now }
*/

export default class WishItem extends React.PureComponent {

  render() {
    const textColor = this.props.selected ? 'red' : 'black';
    return (
        <View style={styles.container}>
          <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
            <CategoryIcon {...this.props.category} />
            <Text style={{color: textColor}}>{moment(this.props.createdAt).format('MMM Do h:mma')}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <Text style={styles.h1}>{this.props.title}</Text>
            <Text style={styles.body}>{this.props.body}</Text>
          </View>
          {this.props.encampment ?
          <EncampmentLink {...this.props.encampment}  />
          :
          <LocationLink {...this.props.location} />
          }
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
