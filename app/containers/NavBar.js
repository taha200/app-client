import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Header, Left, Title, Right } from "native-base";
import asse from "../asse";
import Metrics from "../utils/metrics";
import { ETFonts } from "../asse/FontConstants";
import { EDColors } from "../asse/Colors";
import {Icon} from 'react-native-elements'
export default class NavBar extends React.Component {
  render() {
    return (
      <Header
        androidStatusBarColor={EDColors.primary}
        style={{ backgroundColor: EDColors.primary }}
      >
        {this.props.left == "Back" ? (
          <Left style={{ flex: 3, marginLeft: 10 }}>
            <TouchableOpacity
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              style={{ flexDirection: "row", alignItems: "center", width: 40 }}
              onPress={this.props.onLeft}
            >
           <Icon
 name='ios-arrow-round-back'
  type='ionicon'
  color='white'
  size={40}
/>
            </TouchableOpacity>
          </Left>
        ) : this.props.left == "Menu" ? (
          <Left style={{ flex: 3, marginLeft: 10 }}>
            <TouchableOpacity
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: 40
              }}
              onPress={this.props.onLeft}
            >
                  <Icon
 name='ios-menu'
  type='ionicon'
  color='white'
  size={30}
/>
            </TouchableOpacity>
          </Left>
        ) : (
              <Left style={{ flex: 3 }} />
            )}
        <View
          style={{
            flex: 8,
            paddingLeft: 5,
            paddingRight: 5,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center"
          }}
        >
          <Title
            style={{
              textAlign: "center",
              alignSelf: "center",
              color: "white",
              fontSize: 15,
              fontFamily: ETFonts.bold
            }}
          >
            {this.props.title ? this.props.title + "" : null}
          </Title>
        </View>

        <Right style={{ flex: 3, marginLeft: 10 }}>
          <View style={{ flexDirection: "row" }}>
            {this.props.right.map((item, index) => {
              if (item.name != undefined && item.name == "Cart") {

                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      width: 40
                    }}
                    onPress={() => {
                      this.props.onRight(index);
                    }}
                  >
                    <View style={{ flex: 1 }}>
                    <Icon
 name='ios-cart'
  type='ionicon'
  color='white'
  size={35}
/>
                    </View>
                    {item.value != undefined &&
                      item.value != null &&
                      item.value > 0 ? (
                        <View style={{
                          borderRadius: 10,
                          height: 18,
                          width: 18,
                          backgroundColor: "black",
                          color: "white",
                          marginLeft: 17,
                          marginBottom: 27,
                          alignItems: "center",
                          textAlign: "center",
                          textAlignVertical: "center",
                          fontSize: 10,
                          position: "absolute"
                        }}>
                          <Text
                            style={{
                              color: "white",
                            }}
                          >
                            {item.value}
                          </Text>
                        </View>
                      ) : null}
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: 40
                    }}
                    onPress={() => {
                      this.props.onRight(index);
                    }}
                  >
                          <Icon
 name='filter'
  type='material-community'
  color='white'
  size={28}
/>
                  </TouchableOpacity>
                );
              }
            })}
          </View>
        </Right>
      </Header>
    );
  }
}

const styles = StyleSheet.create({
  topbar: {
    width: "100%",
    flex: 0,
    height: Metrics.navbarHeight + Metrics.statusbarHeight,
    backgroundColor: EDColors.primary
  },
  navbar: {
    backgroundColor: EDColors.primary,
    flex: 0,
    width: "100%",
    height: Metrics.navbarHeight,
    borderBottomColor: EDColors.primary,
    marginTop: Metrics.statusbarHeight + 10,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 5,
    paddingRight: 5
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  left: {
    color: EDColors.primary,
    height: 23,
    width: 23,
    resizeMode: "stretch"
  },
  leftImage: {
    height: 23,
    width: 23,
    resizeMode: "stretch",
    alignSelf: "flex-start"
  }
});
