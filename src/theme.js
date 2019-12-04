import {  StyleSheet, Dimensions } from "react-native";
import colors from "./config/colors";
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.ALMOST_WHITE,
    minHeight:'100vh'
  },
  container: {
    flexDirection:'column',
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.ALMOST_WHITE
  },
  row : {
    flexDirection:'row', alignItems: 'center', justifyContent:'space-between', width:'100%',
  },
  col : {
    flexDirection:'column', alignItems: 'center', width:'48%', justifyContent:'flex-start',
  },
  form: {
    paddingTop:10,
    paddingLeft:10,
    paddingRight:10,
    justifyContent:'flex-start',
    alignContent:'flex-start',
    alignItems:'flex-start',
    backgroundColor: colors.ALMOST_WHITE,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width:'100%',
    height:'100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:999999
  },
  logo: {
    width: "100%",
    height:300,
    backgroundColor: colors.ALMOST_WHITE,
    resizeMode: "contain",
    alignSelf: "center"
  },
  errorMessage: {
    fontSize: 12,
    color: 'red',
  },

  picker: {
    height: 40,
    backgroundColor: colors.WHITE,
    borderRadius:8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20
  },
  map: {
    flex:1,
    position:'relative',
    width:(width - 30),
    height: (height/3),
    marginVertical:10
  },
});


export default styles;
