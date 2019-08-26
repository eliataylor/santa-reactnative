import * as React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import colors from "../config/colors";

// We support all the TextInput props + an error prop
type Props = TextInputProps & {
  error?: string;
};

class FormTextInput extends React.Component<Props> {

  // Create a React ref that will be used to store the
  // TextInput reference
  textInputRef = React.createRef<TextInput>();

  // Expose a `focus` method that will allow us to focus
  // the TextInput
  focus = () => {
    if (this.textInputRef.current) {
      this.textInputRef.current.focus();
    }
  };

  render() {
    const { error, help, style, ...otherProps } = this.props;
    return (
      <View style={[styles.container, style]}>
        <TextInput
          ref={this.textInputRef}
          selectionColor={colors.DODGER_BLUE}
          style={[styles.textInput, style]}
          {...otherProps}
        />
        {(help && help !== '') ? <Text style={styles.helpText}>{help}</Text> : null}
        {(error && error !== '') ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    position:'relative'
  },
  textInput: {
    height: 40,
    borderColor: colors.SILVER,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20
  },
  helpText: {
    margin:-18,
    color: colors.SILVER,
    paddingLeft:20
  },
  errorText: {
    height: 20,
    color: colors.TORCH_RED
  }
});

export default FormTextInput;
