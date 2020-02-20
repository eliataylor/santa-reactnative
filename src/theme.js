import {  StyleSheet, Dimensions } from "react-native";
import colors from "./config/colors";
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.ALMOST_WHITE,
    height:'100%',
  },
  container: {
    flexDirection:'column',
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.ALMOST_WHITE,
  },
  paddedContainer: {
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:10,
    paddingRight:10,
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
    width:'100%',
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
  header : {
    fontFamily:'Poppins-ExtraBold',
    textAlign:'center',
    color:colors.BLACK,
    fontSize:26,
    width:'100%'
  },
  subheader : {
    fontFamily:'Poppins-Bold',
    textAlign:'center',
    color:colors.BLACK,
    fontSize:18,
    width:'100%'
  },
  prompt : {
    fontFamily:'Poppins-Medium',
    fontSize:14,
    marginVertical:4,
    color:colors.ALMOST_WHITE,
    textAlign:'center'
  },
  timestamp : {
    fontFamily:'Poppins-Medium',
    fontSize:15
  },
  errorMessage: {
    fontSize: 12,
    color: 'red',
    fontFamily:'Poppins-ExtraBold',
  },
  picker: {
    height: 40,
    width:'100%',
    backgroundColor: colors.WHITE,
    fontFamily:'Poppins-ExtraBold',
    paddingVertical:10,
    paddingLeft:10,
    borderRadius:8,
    marginBottom:15,
    fontWeight: 'bold',
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
