import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Dropdown } from 'react-native-material-dropdown';

import { ETFonts } from "../asse/FontConstants";
import { EDColors } from "../asse/Colors";
import metrics from "../utils/metrics";

export default class ETSlider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sliderOneValue: [this.props.initialValue],
      value: this.props.initialValue,
      valueType: this.props.valueType
    };
  }
  render() {
    // const { value } = this.state;
    let data = [{
      value: 'Karachi',
    }, {
      value: 'Islamabad',
    }, {
      value: 'Lahore',
    }];
    return (
      <View style={style.container}>
        <View style={{ marginLeft: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={style.title}>City</Text>
            {/* <Text
              style={{
                fontFamily: ETFonts.regular,
                color: "#000"
              }}
            >
              {this.state.value}
            </Text>
            <Text
              style={{
                fontFamily: ETFonts.regular,
                color: "#000",
                marginLeft: 4
              }}
            >
              {this.state.valueType}
            </Text> */}
          </View>
          <Dropdown
        label='Select City'
        data={data}
        onChangeText={(e)=>{
          alert(e)
        }}
      />
        </View>
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
    padding: 10,
    backgroundColor: "#fff",
    margin: 10
  },
  title: {
    flex: 1,
    fontFamily: ETFonts.bold,
    color: "#000"
  },
  marker: {
    borderRadius: 15,
    width: 15,
    height: 15,
    backgroundColor: EDColors.primary
  }
});
