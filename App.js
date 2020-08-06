import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import _ from "lodash";
import { KeyboardAwareView } from "react-native-keyboard-aware-view";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  Container,
  Header,
  Item,
  Input,
  Icon,
  Button,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
} from "native-base";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fullData: [],
      loading: false,
      error: null,
      query: "",
    };
  }

  componentDidMount() {
    this.requestAPIPhotos();
  }

  requestAPIPhotos = _.debounce(() => {
    this.setState({ loading: true });
    const APIUrl = "https://jsonplaceholder.typicode.com/photos?_limit=30";
    fetch(APIUrl)
      .then((res) => res.json())
      .then((resJson) => {
        this.setState({
          loading: false,
          data: resJson,
          fullData: resJson,
        });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      });
  }, 250);

  renderFooter = () => {
    if (!this.state.loading) return null;
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE",
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  _renderItem = ({ item, index }) => {
    return (
      <ListItem avatar>
        <Left>
          <Thumbnail source={{ uri: item.thumbnailUrl }} />
        </Left>
        <Body>
          <Text>{item.title}</Text>
          <Text note>Rs 10</Text>
        </Body>
        <Right>
          <Button light rounded style={{ padding: 15 }} onPress={this.addItem}>
            <Text>+</Text>
          </Button>
        </Right>
      </ListItem>
    );
  };

  addItem = (data) => {};

  handleSearch = (text) => {
    const formattedQuery = text.toLowerCase();
    const data = _.filter(this.state.fullData, (photo) => {
      if (photo.title.includes(formattedQuery)) {
        return true;
      }
      return false;
    });
    this.setState({ data, query: text });
  };

  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <item>
            <Icon name="ios-search" />
            <input placeholder="Search Item" />
          </item>
        </Header>
        <List>
          <FlatList
            data={this.state.data}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={this.renderFooter}
          />
        </List>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
