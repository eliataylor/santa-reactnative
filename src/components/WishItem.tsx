import React, {Component} from "react";
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, Text, Alert, Dimensions } from "react-native";
import colors from "../config/colors";
import strings from "../config/strings";
import Button from "./Button";
import CategoryIcon from "./CategoryIcon";
import LocationLink from "./LocationLink";
import Deadline from "./Deadline";
import moment from "moment";
import { createOffer, updateOffer, deleteWish } from '../redux/entityDataReducer';

import baseStyles from '../theme';
const styles = Object.assign({...baseStyles}, StyleSheet.create({
  container: {
    marginTop:5,
    marginBottom:25,
    paddingTop:4,
    paddingBottom:10,
    paddingHorizontal:10,
    borderColor: colors.SILVER,
    backgroundColor:colors.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  h1: {
    fontFamily:'Poppins-Bold',
    fontSize:18
  },
  h2: {
    fontFamily:'Poppins-Bold',
    fontSize:16,
  },
  em: {
    fontFamily:'Poppins-BoldItalic',
    fontStyle:'italic'
  },
  body: {
    fontFamily:'Poppins-Regular',
    fontSize:14,
    marginTop:5
  },
  listhead : {
    fontSize:22,
    color:colors.SOFT_RED
  }
}));

const { width, height } = Dimensions.get('window');

class WishItem extends Component {

  startOffer() {
    var that = this;
    const {wish} = this.props;
    Alert.alert(
      strings.FULFILL,
      strings.FULFILL_PROMPT,
      [
        {text: strings.YES, onPress: () => {
            that.props.createOffer(wish);
          }
        },
        {text: strings.NO, onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

  deleteWish() {
    var that = this;
    const {wish} = this.props;
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this wish?',
      [
        {text: strings.YES, onPress: () => {
            that.props.deleteWish(wish._id);
          }
        },
        {text: strings.NO, onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

  updateOffer(verb) {
    var that = this;
    const {offer} = this.props;
    var prompt = (verb === 'fulfilled') ? strings.OFFER_FULFILL : strings.OFFER_CANCEL
    Alert.alert(
      prompt,
      null,
      [
        {text: strings.YES, onPress: () => {
            that.props.updateOffer(offer, verb);
          }
        },
        {text: strings.NO, onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

/*  openWish() {
    this.props.navigation.navigate('WishDetail', {wish:this.props.wish, offer:this.props.offer});
  } */

  render() {
    const { wish, offer } = this.props;

    return (
        <View style={styles.container}>

          <View>
            <View style={styles.line}>
              <CategoryIcon id={wish.category} onPress={e => this.props.toggleCat(wish.category)} />
              <View style={{marginLeft:5}}>
                <Text style={styles.h1}>{wish.title}</Text>
                <Text style={styles.timestamp}>Posted {moment(wish.createdAt).format('MMM Do h:mma')}</Text>
                {(offer && offer.state === 'inprogress')
                    ? <Deadline created={offer.createdAt} timeout={offer.timeout || 5400} />
                    : null}
              </View>
            </View>
            <View style={{marginVertical:10}}>
              <LocationLink maptype='staticmap' {...wish.location} width={width - 20} height={height/3} />
            </View>
            <View style={styles.row}>
              <Text style={styles.h2}>for <Text style={styles.em}>{wish.recipient}</Text></Text>
              {(offer && offer.state === 'inprogress')
              ?
                <View style={styles.line}>
                    <Button label={strings.DELIVERED} onPress={(e) => this.updateOffer('fulfilled')}
                            style={{paddingVertical:2, marginHorizontal:15}}/>
                    <Button label={strings.CANCEL} onPress={(e) => this.updateOffer('canceled')}
                            style={{backgroundColor:colors.SOFT_RED, paddingVertical:2}} />
                 </View>
              : (wish.elf._id === this.props.me._id) ?
                <View style={styles.line}>
                    <Button  label={strings.FULFILL} onPress={(e) => this.startOffer()}
                      style={{paddingVertical:2}}/>
                    <Button  label={strings.DELETE} onPress={(e) => this.deleteWish()}
                      style={{backgroundColor:colors.SOFT_RED, paddingVertical:2}}/>
                 </View>
              :
               <Button label={strings.FULFILL} onPress={(e) => this.startOffer()}
                      style={{paddingVertical:2}}/>
              }
            </View>
            <Text style={styles.body}>{wish.body}</Text>
          </View>

        </View>
    );
  }
}

const mapDispatchToProps = {
  createOffer: (item) => createOffer(item),
  deleteWish: (id) => deleteWish(id),
  updateOffer: (item, state) => updateOffer(item, state)
}

const mapStateToProps = state => ({
  me: state.auth.me
})

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(WishItem))
