import * as React from "react";
import { StyleSheet, Text } from "react-native";
import colors from "../config/colors";
import moment from "moment";

interface Props {
  deadline: string;
}

interface State {
  remaining:string;
}

class Deadline extends React.Component<Props, State> {

  readonly state: State = {
    remaining: '1:30:00'
  };

  componentDidMount() {
    const { created, timeout } = this.props;
    var countDownDate = moment(created).add(timeout, 'seconds');
    var that = this;
    this.interval = setInterval(function() {
      var diff = countDownDate.diff(moment());

      if (diff <= 0) {
        clearInterval(this.interval);
        that.setState({remaining:'expired'});
      } else {
        that.setState({remaining:moment.utc(diff).format("HH:mm:ss")});
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
        <Text style={styles.text}>{this.state.remaining}</Text>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: colors.SOFT_RED,
    fontFamily:'Poppins-Medium',
    textAlign: "left",
    fontSize:15
  }
});

export default Deadline;
