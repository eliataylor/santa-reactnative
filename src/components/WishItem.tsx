import * as React from "react";
import { connect } from 'react-redux';
import { StyleSheet, View, Text, Alert } from "react-native";
import colors from "../config/colors";
import strings from "../config/strings";
import Button from "./Button";
import CategoryIcon from "./CategoryIcon";
import LocationLink from "./LocationLink";
import Deadline from "./Deadline";
import moment from "moment";
import { createOffer, updateOffer, deleteWish } from '../redux/entityDataReducer';

class WishItem extends React.PureComponent {

  startOffer() {
    var that = this;
    const {wish} = this.props;
    Alert.alert(
      strings.FULFILL,
      strings.FULLFIL_PROMPT,
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
      cta = <View style={styles.btnGroup}>
            <Button label={'Mark Delivered'} style={{backgroundColor:colors.LIGHT_GREEN}}
                    onPress={(e) => this.updateOffer('fulfilled')} />
            <Button label={'Cancel'} style={{backgroundColor:colors.TORCH_RED}}
                    onPress={(e) => this.updateOffer('canceled')} />
            </View>
    } else if (wish.elf._id === this.props.me._id){
      cta = <View style={styles.btnGroup}>
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
          <View style={styles.timeframe}>
            <CategoryIcon id={wish.category} />
            <Text>{moment(wish.createdAt).format('MMM Do h:mma')}</Text>
            {(offer && offer.state === 'inprogress') ? <Deadline created={offer.createdAt} timeout={offer.timeout || 5400} /> : null}
          </View>
          <View style={styles.details}>
            <View style={styles.left}>
              <Text style={styles.h1}>{wish.title}</Text>
              <Text style={styles.body}>{wish.body}</Text>
              {cta}
            </View>
            <View style={styles.right}><LocationLink {...wish.location} /></View>
          </View>
        </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
      marginTop:15,
      marginBottom:0,
      borderColor: colors.SILVER,
      borderBottomWidth: StyleSheet.hairlineWidth
  },
  btnGroup: {flex: 1, flexDirection: 'row', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center'},
  timeframe: {flex: 1, flexDirection: 'row', justifyContent:'space-between', alignItems:'center'},
  details: {width:'100%', height:150, flexDirection:'row', flexWrap:'nowrap', justifyContent:'space-between', alignItems:'flex-start', alignContent:'flex-start'},
  left: { width:'49%', alignSelf:'flex-start' },
  right: { width:'49%', alignSelf:'flex-start' },
  h1: {
    fontWeight: 'bold',
    fontSize:18,
  },
  body: {
    fontWeight:'normal',
    fontSize:14
  }
});

const mapDispatchToProps = {
  createOffer: (item) => createOffer(item),
  deleteWish: (id) => deleteWish(id),
  updateOffer: (item, state) => updateOffer(item, state)
}

const mapStateToProps = state => ({
  me: state.auth.me
})

export default connect(mapStateToProps, mapDispatchToProps)(WishItem)
