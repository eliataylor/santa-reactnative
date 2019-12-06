import React, {Component} from "react";
import { connect } from 'react-redux';
import { StyleSheet, View, Text, Alert, Modal, Dimensions, Image, TouchableHighlight, SafeAreaView } from "react-native";
import colors from "../config/colors";
import strings from "../config/strings";
import Button from "../components/Button";
import CategoryIcon from "../components/CategoryIcon";
import LocationLink from "../components/LocationLink";
import Icon from "../components/Icon";
import Deadline from "../components/Deadline";
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
    fontSize:18,
  },
  body: {
    fontFamily:'Poppins-Regular',
    fontSize:14
  },
  listhead : {
    fontSize:22,
    color:colors.SOFT_RED
  }
}));

const { width, height } = Dimensions.get('window');

class WishDetail extends Component {

  startOffer() {
    var that = this;
    const {wish} = this.props.navigation.state.params;
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
    const {wish} = this.props.navigation.state.params;
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
    const {offer} = this.props.navigation.state.params;
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

  componentDidUpdate(prevProps) {
    if (!prevProps.entity || !prevProps.entity.lastsucces || prevProps.entity.lastsucces < this.props.entity.lastsucces) {
      this.props.navigation.navigate('Wishes');
    }
  }

  render() {
    const { wish, offer } = this.props.navigation.state.params;

    return (
        <View style={styles.container}>
               <View style={styles.row}>
                 <Text style={styles.h1}>{wish.title}</Text>
                 <CategoryIcon id={wish.category} />
               </View>
               <Text>{moment(wish.createdAt).format('MMM Do h:mma')}</Text>
               {(offer && offer.state === 'inprogress') ? <Deadline created={offer.createdAt} timeout={offer.timeout || 5400} /> : null}

               <Text style={[styles.body, {marginVertical:20}]}>{wish.body}</Text>

               <LocationLink maptype='staticmap' width={width} height={height/4} {...wish.location} />

               {(offer && offer.state === 'inprogress')
               ?
                  <View style={[styles.row, {marginTop:10}]}>
                     <Button label={'Mark Delivered'} onPress={(e) => this.updateOffer('fulfilled')} />
                     <Button label={'Cancel'} style={{backgroundColor:colors.SOFT_RED}}
                             onPress={(e) => this.updateOffer('canceled')} />
                  </View>
               : (wish.elf._id === this.props.me._id) ?
                  <View style={[styles.row, {marginTop:10}]}>
                     <Button  label={strings.FULFILL} onPress={(e) => this.startOffer()} />
                     <Button label={'Delete'} style={{backgroundColor:colors.SOFT_RED}} onPress={(e) => this.deleteWish()} />
                  </View>
               :
                <View style={[styles.row, {marginTop:10}]}><Button label={strings.FULFILL} onPress={(e) => this.startOffer()} /></View>
               }
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

export default connect(mapStateToProps, mapDispatchToProps)(WishDetail)
