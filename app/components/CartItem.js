import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity,Dimensions,Modal,TextInput } from "react-native";
import { ETFonts } from "../asse/FontConstants";
import { Rating } from "react-native-ratings";
import asse from "../asse";
import { EDColors } from "../asse/Colors";

export default class CartItem extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(props) {
    this.setState({ quantity: props.quantity });
  }

  state = {
    quantity: this.props.quantity > 0 ? this.props.quantity : 0,
    isRefresh: false,
    openModal:false,
    val:0
  };
  clickModal=()=>{
    this.setState({
      openModal:!this.state.openModal
    })
  }
  deleteDialog=()=> {
    return (
      <View style={style.modalContainer}>
        <View style={style.modalSubContainer}>
          <Text style={style.deleteTitle}>{Messages.deleteItemMsg}</Text>

          <View style={style.optionContainer}>
            <Text
              style={style.deleteOption}
              onPress={() => {
                var array = this.cartResponse.items;
                array.splice(this.deleteIndex, 1);
                this.getCartData(array);
                this.setState({ isDeleteVisible: false });
              }}
            >
              Yes
            </Text>

            <Text
              style={style.deleteOption}
              onPress={() => {
                this.deleteIndex = -1;
                this.setState({ isDeleteVisible: false });
              }}
            >
              No
            </Text>
          </View>
        </View>
      </View>
    );
  }
  render() {
    return (
      <View style={style.container}>
        <Image style={style.itemImage} source={{ uri: this.props.itemImage }} />

        <View style={{ flex: 4, marginTop: 10, marginLeft: 10 }}>
          <View style={{ flexDirection: "row" }}>
        
            <Text style={style.itemName}>{this.props.itemName}</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text onPress={()=>this.clickModal()}>More than five</Text>
            <View style={style.qunContainer}>

              <TouchableOpacity
                style={style.roundButton}
                onPress={() => {
                  if (this.state.quantity != 0) {
                    this.setState({ quantity: this.state.quantity - 1 });
                    this.props.onMinusClick(this.state.quantity - 1);
                  }
                }}
              >
                <Image source={asse.ic_minus} style={{ margin: 5 }} />
              </TouchableOpacity>

              <Text style={{ margin: 2 }}>{this.state.quantity}</Text>

              <TouchableOpacity
                style={style.roundButton}
                onPress={() => {
                  if (this.state.quantity >= 0) {
                    this.setState({ quantity: this.state.quantity + 1 });
                    this.props.onPlusClick(this.state.quantity + 1);
                  }
                }}
              >
                <Image source={asse.ic_plus} style={{ margin: 5 }} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={style.price}>{this.props.price}</Text>
        </View>
       

        <TouchableOpacity
          style={style.deleteContainer}
          onPress={() => {
            this.props.deleteClick();
          }}
        >
          <Image source={asse.delete_cart} style={{}} />
        </TouchableOpacity>
        {(this.state.openModal)?
        <Modal
        visible={this.state.openModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          this.setState({ openModal: false });
        }}
      >
        <View style={style.modalContainerrr}>
          <View style={style.modalSubContainerr}>
            <View style={{ flexDirection: "row", height: 20 }}>
            <Text
                style={{
                  flex: 1,
                  alignSelf: "center",
                  textAlign: "center",
                  color: "#000",
                  fontSize: 15
                }}
              >
                Enter the Number of items
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ openModal: false });
                }}
              >
                <Image
                  style={{ alignSelf: "center", height: 15, width: 15 }}
                  source={asse.ic_close}
                />
              </TouchableOpacity>
            </View>
              <TextInput
              style={style.modalinput}
              keyboardType="numeric"
              value={this.state.quantity}
              onChangeText={(val) => 
                {
                  this.setState({ val });
              }}
              secureTextEntry={false}
              placeholder="Number of items"
            />
            <TouchableOpacity
            onPress={() => {
              var abc=parseInt(this.state.quantity)
              var bcd = parseInt(this.state.val)
              var ccd=bcd+abc
              this.setState({ openModal: false });
              this.props.onMoreThanFive(ccd,bcd);
            }}>
              <Text style = {style.text}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>  
       :
       null
      }
      </View>
    );
  }
}


export const style = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignSelf: "flex-start"
  },
  text: {
    borderWidth: 1,
    borderColor: '#4464ac',
    color:'white',
    backgroundColor: '#4464ac',
    alignSelf:"center",
    marginTop:20,
    padding:20,
    borderRadius:8,
 },
  modalinput:{
    borderRadius: 6,
    borderWidth:2,
    marginTop:30,
    borderColor:"#4464ac",
  },
  modalContainerrr: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.50)"
    
  },
  emptyView: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    alignContent: "center",
    color: "#000",
    fontSize: 15,
    fontFamily: ETFonts.regular
  },
  modalSubContainerr: {
    backgroundColor: "#fff",
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 6,
    width: Dimensions.get("window").width - 40,
    height: "50%" ,
    marginTop: 20,
    marginBottom: 20
  },
  itemImage: {
    flex: 2,
    borderRadius: 6,
    marginLeft: 8,
    marginBottom: 8,
    marginTop: 8
  },
  itemName: {
    flex: 1,
    fontSize: 18,
    fontFamily: ETFonts.bold,
    color: "#000",
    marginLeft: 5
  },
  qunContainer: {
    flex: 1,
    flexDirection: "row",
    marginRight: 10,
    justifyContent: "flex-end"
  },
  roundButton: {
    margin: 2,
    borderRadius: 10,
    backgroundColor: EDColors.primary,
    justifyContent: "center"
  },
  price: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 15,
    fontFamily: ETFonts.regular
  },
  deleteContainer: {
    flex: 0.8,
    backgroundColor: EDColors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6
  }, 
   modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.50)"
  },
  modalSubContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 6,
    marginTop: 20,
    marginBottom: 20
  },
  deleteOption: {
    fontFamily: ETFonts.bold,
    fontSize: 12,
    color: "#fff",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    margin: 10,
    backgroundColor: EDColors.primary
  }
});
// currentOrderStatus = [
//   {
//     image: status.toLowerCase() === "placed" || status.toLowerCase() === "preparing" || status.toLowerCase() === "ongoing" || status.toLowerCase() === "delivered"   ?{name:"check",type:"entypo",color:"white",backgroundColor:"#f06136"}:{name:"check",type:"entypo",color:"black",backgroundColor:"white"},
//     time: placedTime,
//     orderStatusText: "Placed"
//   },
//   {
//     image:
//       status.toLowerCase() === "preparing" || status.toLowerCase() === "ongoing" || status.toLowerCase() === "delivered"
//         ? {name:"package-variant",type:"material-community",color:"white",backgroundColor:"#f06136"}
//         : {name:"package-variant",type:"material-community",color:"black",backgroundColor:"white"},
//     time: preparingTime,
//     orderStatusText: "Preparing"
//   },
//   {
//     image:
//     status.toLowerCase() === "ongoing" || status.toLowerCase() === "delivered"
//       ? {name:"motorcycle",type:"fontisto",color:"white",backgroundColor:"#f06136"}
//       : {name:"motorcycle",type:"fontisto",color:"black",backgroundColor:"white"} ,
//     time: onGoingTime,
//     orderStatusText: "On the way"
//   },
//   {
//     image:
//       status.toLowerCase() === "delivered"
//       ? {name:"package",type:"octicon",color:"white",backgroundColor:"#f06136"}
//       : {name:"package",type:"octicon",color:"black",backgroundColor:"white"},
//     isLine: false,
//     isComplete: false,
//     time: deliveredTime,
//     orderStatusText: "Delivered"
//   }
// ];