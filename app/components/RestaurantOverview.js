import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import TextViewLeftImage from "./TextViewLeftImage";
import asse from "../asse";
import { ETFonts } from "../asse/FontConstants";
import { EDColors } from "../asse/Colors";
import { capitalize } from "../utils/Constants";

export default class RestaurantOverview extends React.PureComponent {
  render() {
    return (
      <View style={style.container}>
        <Text
          style={{
            fontFamily: ETFonts.regular,
            color: "#000",
            fontSize: 20
          }}
        >
          {this.props.resName}
        </Text>
        <TextViewLeftImage
          image={asse.address}
          text={this.props.address}
          lines={0}
        />
        <View style={{ marginTop: 10, height: 1, backgroundColor: "#000" }} />

        <View
          style={{
            flex: 1,
            marginTop: 5,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          {this.props.review != null && this.props.review.length > 0 ? (
            <TextViewLeftImage
              image={asse.rating}
              text={this.props.review}
              lines={0}
            />
          ) : null}

          <View style={{ flex: 2 }}>
            {this.props.timing != "" ? (
              <TextViewLeftImage
                image={asse.time}
                text={this.props.timing}
                lines={0}
              />
            ) : null}
          </View>

            <TouchableOpacity
              activeOpacity={1.0}
              onPress={() => {
                this.props.onButtonClick("");
              }}
              style={{ flex: 1 }}
            >
              <TextViewLeftImage
                text="Menu"
                lines={0}
              />
            </TouchableOpacity>
          {/* <View activeOpacity={1.0} style={style.button}>
            <Text
              style={{
                fontFamily: ETFonts.regular,
                color: "#fff",
                fontSize: 12
              }}
            >
              {capitalize(this.props.buttonText)}
            </Text>
          </View> */}
        </View>
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: "#fff",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    margin: 8
  },
  button: {
    borderRadius: 6,
    backgroundColor: EDColors.primary,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 10,
    alignItems: "center"
  }
});
