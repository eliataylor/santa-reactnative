import React, {Component} from "react";
import { connect } from 'react-redux';
import { StyleSheet, View, Text, Alert, Modal, Dimensions, Image, TouchableHighlight, SafeAreaView } from "react-native";
import colors from "../config/colors";
import strings from "../config/strings";
import Button from "./Button";
import CategoryIcon from "./CategoryIcon";
import LocationLink from "./LocationLink";
import Icon from "./Icon";
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

class WishItem extends Component {

  state = {
    modalVisible: false,
  };

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

  render() {
    const { wish, offer } = this.props;

    return (
        <View style={styles.container}>

          <Modal animationType="slide" visible={this.state.modalVisible === true} >
             <View style={styles.paddedContainer}>
               <Icon
                 onPress={(e) => { console.log("close modal"); this.setState({modalVisible:false}) } }
                 icon={require('../assets/images/baseline_undo_black_18dp.png')}
                 label={'Close'}
                 tintColor={colors.SOFT_RED}
                 style={{marginBottom:10}}
                 />
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
          </Modal>

          <View style={styles.row}>
            <View style={[styles.col, {alignItems:'flex-start'}]}>
              <CategoryIcon id={wish.category} />
              <TouchableHighlight onPress={e => this.setState({modalVisible:true}) }>
                <Text style={styles.h1}>{wish.title}</Text>
              </TouchableHighlight>
              <Text style={styles.body}>{wish.body}</Text>
              <View style={styles.row}>
                <Icon
                  onPress={e => this.setState({modalVisible:true})}
                  label="more info"
                  tintColor={colors.SOFT_RED}
                  icon={require('../assets/images/baseline_info_black_18dp.png')}
                  />
                {(wish.elf._id === this.props.me._id) ?
                <Icon
                  onPress={e => this.setState({modalVisible:true})}
                  label="delete"
                  icon={require('../assets/images/baseline_delete_black_18dp.png')}
                  /> : null}
              </View>
            </View>
            <View style={styles.col}>
              <Text style={styles.timestamp}>Posted {moment(wish.createdAt).format('MMM Do h:mma')}</Text>
              {(offer && offer.state === 'inprogress')
              ? <Deadline created={offer.createdAt} timeout={offer.timeout || 5400} />
              : null}
              <LocationLink maptype='staticmap' {...wish.location} />
            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(WishItem)
