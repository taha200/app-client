import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { ETFonts } from "../asse/FontConstants";
import asse from "../asse";
import { EDColors } from "../asse/Colors";
import metrics from "../utils/metrics";
import {Icon} from 'react-native-elements'
export default class OrderStatusCard extends React.PureComponent {
  componentDidMount(){
  
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",

          width: ((metrics.screenWidth - 20) / 7) + 3,
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontFamily: ETFonts.regular,
            color: EDColors.primary
          }}
          numberOfLines={this.props.lines}
        >
          {this.props.text}
        </Text>
        <Text
          style={{
            fontSize: 9,
            fontFamily: ETFonts.regular,
          }}
        >
          {this.props.heading}
        </Text>
        {/* <Image style={{ width: ((metrics.screenWidth - 20) / 7) + 3, height: ((metrics.screenWidth - 20) / 7) + 3, marginTop: 5 }} source={this.props.image} /> */}
      <View style={{ width: ((metrics.screenWidth - 20) / 7) + 3, height: ((metrics.screenWidth - 20) / 7) + 3, marginTop: 5,borderRadius:100,backgroundColor:this.props.image.backgroundColor,justifyContent:"center",alignItems:"center"}}>
      <Icon name={this.props.image.name} type={this.props.image.type} color={this.props.image.color} />
      </View>
      </View>
    );
  }
}
