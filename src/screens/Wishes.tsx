import * as React from "react";
import { connect } from 'react-redux';
import { FlatList } from "react-native";
import colors from "../config/colors";
import strings from "../config/strings";
import WishItem from "../components/WishItem";

interface State {
  selected: boolean;
}

class Wishes extends React.Component<{}, State> {

  readonly state: State = {
    selected: false
  };

  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
  };

  _renderItem = ({item}) => (
    <WishItem
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      {...item}
    />
  );

  render() {

    return (
      <FlatList
        data={this.props.lists}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

const mapDispatchToProps = {
  // authenticate: (username, password) => authenticate(username, password)
}

const mapStateToProps = state => ({
  lists: state.lists
})

export default connect(mapStateToProps, mapDispatchToProps)(Wishes)
