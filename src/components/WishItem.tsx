import React, {Component} from "react";
import { connect } from 'react-redux';
import { StyleSheet, View, Text, Alert, Modal, Image, TouchableHighlight } from "react-native";
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
const styles = Object.assign(baseStyles, StyleSheet.create({
  container: {
    marginTop:5,
    marginBottom:25,
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
  subheader : {
    fontSize:22,
    color:colors.SOFT_RED
  }
}));

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
    var cta = null;
    if (offer && offer.state === 'inprogress') {
      cta = <View style={styles.row}>
            <Button label={'Mark Delivered'} style={{backgroundColor:colors.LIGHT_GREEN}}
                    onPress={(e) => this.updateOffer('fulfilled')} />
            <Button label={'Cancel'} style={{backgroundColor:colors.TORCH_RED}}
                    onPress={(e) => this.updateOffer('canceled')} />
            </View>
    } else if (wish.elf._id === this.props.me._id){
      cta = <View style={styles.row}>
              <Button  label={strings.FULFILL} style={{backgroundColor:colors.LIGHT_GREEN}}
              onPress={(e) => this.startOffer()} />
              <Button
              label={'Delete'} style={{backgroundColor:colors.TORCH_RED}}
              onPress={(e) => this.deleteWish()} />
            </View>
    } else {
      cta = <Button
              label={strings.FULFILL} style={{backgroundColor:colors.LIGHT_GREEN}}
              onPress={(e) => this.startOffer()} />
    }

    return (
        <View style={styles.container}>

          <Modal animationType="slide" visible={this.state.modalVisible === true} >
              <Button label="Close" onPress={e => this.setState({modalVisible:false}) } />
             <View>
               <Text style={styles.subheader}>Wish</Text>
               <Text style={styles.h1}>{wish.title}</Text>
               <CategoryIcon id={wish.category} />
               <Text>{moment(wish.createdAt).format('MMM Do h:mma')}</Text>
               {(offer && offer.state === 'inprogress') ? <Deadline created={offer.createdAt} timeout={offer.timeout || 5400} /> : null}

               <Text style={styles.subheader}>Details</Text>
               <Text style={styles.body}>{wish.body}</Text>

               <Text style={styles.subheader}>Location</Text>
               <View><LocationLink maptype='staticmap' {...wish.location} /></View>
               <View><LocationLink maptype='streetview' {...wish.location} /></View>
               {cta}
             </View>
          </Modal>

          <View style={styles.row} >
            <CategoryIcon id={wish.category} />
            <Text style={{fontFamily:'Poppins-Medium'}}>Posted {moment(wish.createdAt).format('MMM Do h:mma')}</Text>
            {(offer && offer.state === 'inprogress') ?
            <Deadline created={offer.createdAt} timeout={offer.timeout || 5400} /> : null}
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <TouchableHighlight onPress={e => this.setState({modalVisible:true}) }>
                <Text style={styles.h1}>{wish.title}</Text>
              </TouchableHighlight>
              <Text style={styles.body}>{wish.body}</Text>
              <View style={styles.row}>
                <Icon
                  onPress={e => this.setState({modalVisible:true})}
                  label="more info"
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
              <LocationLink maptype='streetview' {...wish.location} />
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
