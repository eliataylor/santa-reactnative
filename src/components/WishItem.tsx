import * as React from "react";
import { connect } from 'react-redux';
import { TouchableOpacity, View, Text } from "react-native";
import colors from "../config/colors";
import strings from "../config/strings";

import CategoryIcon from "./CategoryIcon";
import LocationLink from "./LocationLink";

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
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const textColor = this.props.selected ? 'red' : 'black';
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View>
          <CategoryIcon {...this.props.category} />
          <Text style={{color: textColor}}>{this.props.state}</Text>
          <Text style={{color: textColor}}>{this.props.createdAt}</Text>
          <Text style={{color: textColor}}>{this.props.title}</Text>
          <Text style={{color: textColor}}>{this.props.body}</Text>
          {this.props.encampment ?
          <EncampmentLink {...this.props.encampment}  />
          :
          <LocationLink {...this.props.location} />
          }
        </View>
      </TouchableOpacity>
    );
  }
}
