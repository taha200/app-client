import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SectionList,
  Modal,
  Dimensions,
  TouchableOpacity,
  Platform,
  WebView
} from "react-native";
import BaseContainer from "./BaseContainer";
import asse from "../asse";
import ProgressLoader from "../components/ProgressLoader";
import { ETFonts } from "../asse/FontConstants";
import { EDColors } from "../asse/Colors";
import {
  saveCartData,
  getCartList,
  getUserToken
} from "../utils/AsyncStorageHelper";
import {
  GET_RESTAURANT_DETAIL,
  RESPONSE_SUCCESS,
  RESPONSE_FAIL,
  INR_SIGN,
  CART_PENDING_ITEMS
} from "../utils/Constants";
import { Messages } from "../utils/Messages";
import { showValidationAlert } from "../utils/CMAlert";
import { apiPostFormData } from "../api/APIManager";
import { connect } from "react-redux";
import { saveCartCount } from "../redux/actions/Checkout";
import { netStatus } from "../utils/NetworkStatusConnection";
import MyWebView from "react-native-webview-autoheight";
import Toast, { DURATION } from "react-native-easy-toast";
import EDThemeButton from "../components/EDThemeButton";
import HTML from 'react-native-render-html';

class RestaurantDetail extends React.PureComponent {
  constructor(props) {
    super(props);
 
    getUserToken(
      success => {
        user = success;
      },
      fail => { }
    );
    this.resId = this.props.navigation.state.params.resid;
    this.menuItem = [];
    this.foodType = "";
    this.priceType = "";
    this.cartCount = 0;

    this.fontSize = Platform.OS == "ios" ? "18px" : "18px";
    this.meta =
      '<head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>';

    this.customStyle =
      this.meta +
      "<style>* body {font-size:" +
      this.fontSize +
      ";}</style>";
  }

  componentDidMount() {
    this.getRestaurantDetails();
  }

  getRestaurantDetails() {
    netStatus(status => {
      if (status) {
        this.setState({ isLoading: true });
        const formData = new FormData();
        formData.append("restaurant_id", parseInt(this.resId));
        formData.append("food", this.foodType);
        formData.append("price", this.priceType);

        // {
        //   restaurant_id: parseInt(this.resId),
        //   food: this.foodType,
        //   price: this.priceType
        // }

        apiPostFormData(
          GET_RESTAURANT_DETAIL,
          formData,
          response => {
            if (response.error != undefined) {
              showValidationAlert(
                response.error.message != undefined
                  ? response.error.message
                  : Messages.generalWebServiceError
              );
            } else if (response.status == RESPONSE_SUCCESS) {
              this.setState({
                tax:response.restaurant[0].tax
              })
              this.menuItem = [
                {
                  title: "",
                  data: [{ uri: this.props.navigation.state.params.image }],
                  isShow: false,
                  index: 0
                }
              ];

              if (response.menu_item.length > 0) {
                response.menu_item.map((item, index) => {
                  this.menuItem[index + 1] = {
                    title: item.category_name,
                    data: item.items,
                    isShow: index == 0 ? true : false,
                    index: index + 1
                  };
                });
              }
              this.setState({ isLoading: false });
            } else if (response.status == RESPONSE_FAIL) {
              this.setState({ isLoading: false });
            }
          },
          error => {
            this.setState({ isLoading: false });
            showValidationAlert(
              error.response != undefined
                ? error.response
                : Messages.generalWebServiceError
            );
          }
        );
      } else {
        showValidationAlert(Messages.internetConnnection);
      }
    });
  }

  state = {
    isLoading: false,
    isEnable: false,
    visible: false,
    data: "",
    itemTitle: "",
    menuItem: [
      {
        title: "",
        data: [{ uri: this.props.navigation.state.params.image }],
        isShow: false,
        index: 0
      }
    ],
    tax:0,
    opacity:0
  };

  openSideDrawer = () => {
    this.props.navigation.goBack();
  };

  testFunction = data => {
    this.foodType = data.food;
    this.priceType = data.price;

    this.getRestaurantDetails();
  };

  rightClick = index => {
    if (index == 0) {
      if (this.props.cartCount > 0) {
        this.props.navigation.navigate("CartContainer");
      } else {
        showValidationAlert(Messages.cartItemNotAvailable);
      }
    } else if (index == 1) {
      this.props.navigation.navigate("Filter", {
        getFilterDetails: this.testFunction,
        filterType: "menu",
        food: this.foodType,
        price: this.priceType
      });
    }
  };

  render() {
    // this.props.navigation.addListener("didFocus", payload => {
    //   getCartList(
    //     success => {
    //       if (success != undefined) {
    //         cartData = success.items;
    //         if (cartData.length > 0) {
    //           var count = 0;
    //           cartData.map((item, index) => {
    //             count = count + item.quantity;
    //           });

    //           this.props.saveCartCount(count);
    //         } else if (cartData.length == 0) {
    //           this.props.saveCartCount(0);
    //         }
    //       } else {
    //       }
    //     },
    //     onCartNotFound => { },
    //     error => { }
    //   );
    // });
    return (
      <BaseContainer
        title={this.props.navigation.state.params.resName}
        left="Back"
        right={[
          // { url: asse.ic_cart, name: "Cart", value: this.props.cartCount },
          // { url: asse.ic_filter, name: "filter" }
        ]}
        onLeft={this.openSideDrawer}
        onRight={this.rightClick}
      >
                <Toast ref="toast" position="center" fadeInDuration={0} />

        <View style={{ flex: 1 }}>
          <Modal
            visible={this.state.visible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              this.setState({ visible: false });
            }}
            
          >
            <View style={style.modalContainer}>
              <View style={style.modalSubContainer}>
                <View style={{ flexDirection: "row", height: 20 }}>
                  <Text
                    style={{
                      flex: 1,
                      alignSelf: "center",
                      textAlign: "center",
                      fontFamily: ETFonts.bold,
                      color: "#000",
                      fontSize: 15
                    }}
                  >
                    {this.state.data.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ visible: false });
                    }}
                  >
                    <Image
                      style={{ alignSelf: "center", height: 15, width: 15 }}
                      source={asse.ic_close}
                    />
                  </TouchableOpacity>
                </View>

                <Image
                  source={{ uri: this.state.data.image }}
                  style={{
                    width: "100%",
                    height: 180,
                    marginTop: 10,
                    borderRadius: 6
                  }}
                />
                {/* <MyWebView
                  source={{
                    html: this.customStyle + this.state.data.receipe_detail
                  }}
                  scrollEnabled={true}
                  width={Dimensions.get("window").width - 40}
                  height={Dimensions.get("window").height - 220}
                /> */}
                  {/* <WebView
        source={{ uri: 'https://github.com/react-native-community/react-native-webview/blob/master/docs/Getting-Started.md' }}
        style={{ marginTop: 20,opacity:this.state.opacity,backgroundColor:"transparent"}}
      /> */}
                      <HTML html={this.state.data.receipe_detail}  />

              </View>
            </View>
          </Modal>
          {this.menuItem.length > 1 ? (
            <SectionList
              showsVerticalScrollIndicator={false}
              extraData={this.state}
              renderSectionHeader={({ section: { title, index, isShow } }) => {
                return title != "" ? (
                  this.itemHeader(title, index, isShow)
                ) : (
                    <View />
                  );
              }}
              sections={this.menuItem}
              renderItem={({ item, index, section }) => {
                if (section.index == 0) {
                  return (
                    <Image
                      source={{
                        uri: item.uri
                      }}
                      style={{ width: "100%", height: 200 }}
                    />
                  );
                } else {
                  if (section.isShow) {
                    return this.nestedItem(item);
                  } else {
                    return null;
                  }
                }
              }}
              keyExtractor={(item, index) => item + index}
            />
          ) : this.menuItem.length > 0 ? (
            <View style={{ flex: 1 }}>
              <Image
                source={{
                  uri: this.props.navigation.state.params.image
                }}
                style={{ width: "100%", height: 200 }}
              />
              {this.emptyView()}
            </View>
          ) : null}
        </View>
      </BaseContainer>
    );
  }

  emptyView() {
    return <Text style={style.emptyView}>No Data Found</Text>;
  }

  itemHeader(data, index, isShow) {
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        style={style.itemContainer}
        onPress={() => {
          if (isShow) {
            this.menuItem[index].isShow = false;
            this.setState({ isEnable: this.state.isEnable ? false : true });
          } else {
            this.menuItem[index].isShow = true;
            this.setState({ isEnable: this.state.isEnable ? false : true });
          }
        }}
      >
        <Text style={style.itemTitle}>{data}</Text>
        <Image
          style={style.rightImage}
          source={isShow ? asse.ic_down_arrow : asse.ic_up_arrow}
        />
      </TouchableOpacity>
    );
  }

  nestedItem(data) {
    return (
      <TouchableOpacity
        onPress={() => {
       setTimeout(()=>{
         this.setState({
           opacity:1
         })
       },5000)
          this.setState({
            visible: true,
            data: data
                    });
        }}
      >
        <View style={style.nestedContainer}>
          <Image
            source={{ uri: data.image }}
            style={{ height: 70, width: 70, borderRadius: 35 }}
          />
          <View style={{ flex: 4, marginLeft: 10, marginRight: 10 }}>
            <View style={{ flexDirection: "row" }}>
          
              <Text style={style.nestedTitle}>{data.name}</Text>
            </View>
            <Text style={style.nestedDesc}>{data.menu_detail}</Text>

            <Text style={style.nestedPrice}>{INR_SIGN + " " + data.price}</Text>
          </View>
   {(this.props.navigation.state.params.isShow)?
      <View style={{ alignSelf: "center" }}>
      <TouchableOpacity
        onPress={() => {
          this.storeData(data);
        }}
      >
        <View style={style.nestedRoundView}>
          <Image
            source={asse.ic_plus_yellow}
            style={{
              width: 10,
              height: 10
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
   :
   null
  }
       
        </View>
      </TouchableOpacity>
    );
  }

  storeData(data) {
    var cartArray = [];
    var cartData = {};
var abc=[];
var index=0
    //demo changes
    getCartList(
      success => {
        if (success != undefined) {
         
        cartArray=success
          if (success.length > 0) {
          var checkCompInCart= success.filter((item)=>{
                return item.resId===this.resId
            })
            if(checkCompInCart.length>0){
      
                  cartArray.forEach((item,ind)=>{
                    if(item.resId===this.resId){
                // for(var i=0;i<=item.items.length;i++){
                // if(this.resId===item.resId && item.items[i].menu_id===data.menu_id){
                //   cartArray[ind].items[i].quantity=success[ind].items[i].quantity+1
                //   this.saveData(cartArray)
                //   break;
                // }
                // else{
                //    data.quantity=1;
                //    cartArray[ind].items.push(data)
                //    alert(JSON.stringify(cartArray))

                //    this.saveData(cartArray)
                //   break;
                // }
                // }
                
                  var checkSameMenu=item.items.filter((itema)=>{
                  return itema.menu_id===data.menu_id
                })
                 index=item.items.findIndex(x => x.menu_id===data.menu_id)
                 if(checkSameMenu.length>0){
             
                  cartArray[ind].items[index].quantity=success[ind].items[index].quantity+1
                  this.saveData(cartArray)
                  this.refs.toast.show("Item added successfully!", DURATION.LENGTH_SHORT);

                 }
                 else{
                  data.quantity=1;

                  cartArray[ind].items.push(data)
                   this.saveData(cartArray)
                   this.refs.toast.show("Item added successfully!", DURATION.LENGTH_SHORT);

              
                 }
                    }
            })
            }
            else{
                  data.quantity = 1;
              cartData = {
                resId: this.resId,
                items: [data],
                coupon_name: "",
                cart_id: 0,
                tax:this.state.tax
              };
                cartArray.push(cartData)
              this.updateCount(cartData.items);
              this.saveData(cartArray);
              this.refs.toast.show("Item added successfully!", DURATION.LENGTH_SHORT);

            }
            
          
          
              //cart has already data
              // success.map(item=>{
              // cartArray = item.items.filter(itema => {
              //     return itema.menu_id == data.menu_id;
              //   });

              //   if (cartArray.length > 0) {
              //     alert(JSON.stringify(cartArray))

              //     cartArray[0].quantity = cartArray[0].quantity + 1;
              //   } else {
              //     data.quantity = 1;
              //     abc.push(data);
              //   }
              // })
              // this.saveData(abc);

              // cartData = {
              //   resId: this.resId,
              //   items: cartArray,
              //   coupon_name:
              //     success.coupon_name.length > 0 ? success.coupon_name : "",
              //   cart_id: success.cart_id
              // };
              // console.log("CART DATA :::::::: ", cartData)
              // this.updateCount(cartData.items);
              // this.saveData(cartData);
          
          } else if (success.length == 0) {
            //cart empty
            data.quantity = 1;
            cartData = {
              resId: this.resId,
              items: [data],
              coupon_name: "",
              cart_id: 0,
              tax:this.state.tax

            };
              abc.push(cartData)
            this.updateCount(cartData.items);
            this.saveData(abc);
            this.refs.toast.show("Item added successfully!", DURATION.LENGTH_SHORT);

          }
        } else {
          //cart has no data
          data.quantity = 1;
          cartData = {
            resId: this.resId,
            items: [data],
            coupon_name: "",
            cart_id: 0,
            tax:this.state.tax

          };

          abc.push(cartData)
          this.updateCount(cartData.items);
          this.saveData(abc);
          this.refs.toast.show("Item added successfully!", DURATION.LENGTH_SHORT);

        }
      },
      onCartNotFound => {
        //first time insert data
        console.log("onCartNotFound", onCartNotFound);
        data.quantity = 1;
        cartData = {
          resId: this.resId,
          items: [data],
          coupon_name: "",
          cart_id: 0,
          tax:this.state.tax

        };
  
        abc.push(cartData)
        this.updateCount(cartData.items);
        this.saveData(abc);
        this.refs.toast.show("Item added successfully!", DURATION.LENGTH_SHORT);

      },
      error => {
        console.log("onCartNotFound", error);
      }
    );
  }

  updateCount(data) {
    console.log("toast call");
    this.refs.toast.show("Item added successfully!", DURATION.LENGTH_SHORT);
    var count = 0;
    data.map((item, index) => {
      count = count + item.quantity;
    });

    this.props.saveCartCount(count);
    console.log("saveCartCount", saveCartCount);
  }

  saveData(data) {
    saveCartData(data, success => { }, fail => { });
  }
}

export default connect(
  state => {
    console.log("redux ", state);
    return {
      userID: state.userOperations.userIdInRedux,
      token: state.userOperations.phoneNumberInRedux,
      cartCount: state.checkoutReducer.cartCount
    };
  },
  dispatch => {
    return {
      saveCartCount: data => {
        dispatch(saveCartCount(data));
      }
    };
  }
)(RestaurantDetail);

export const style = StyleSheet.create({
  container: {
    flex: 1
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.50)",
   
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
  modalSubContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 6,
    width: Dimensions.get("window").width - 40,
    height: Dimensions.get("window").height - 220,
    marginTop: 20,
    marginBottom: 20
  },
  itemContainer: {
    alignSelf: "flex-start",
    flexDirection: "row",
    margin: 5,
    padding: 4,
    borderRadius: 4,
    backgroundColor: "#fff"
  },
  itemTitle: {
    flex: 3,
    color: "#000",
    padding: 10,
    fontFamily: ETFonts.regular,
    fontSize: 18
  },
  rightImage: {
    alignSelf: "center",
    marginEnd: 10
  },
  nestedContainer: {
    alignSelf: "flex-start",
    borderRadius: 6,
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 10,
    padding: 10
  },
  nestedTitle: {
    fontFamily: ETFonts.bold,
    color: "#000",
    fontSize: 18,
    marginLeft: 5
  },
  nestedDesc: {
    fontFamily: ETFonts.regular,
    fontSize: 10,
    marginTop: 10,
    marginLeft:4
  },
  nestedPrice: {
    fontFamily: ETFonts.regular,
    marginTop: 10,
    color: "#000",
    fontSize: 15
  },
  nestedRoundView: {
    borderWidth: 1,
    borderColor: EDColors.activeTabColor,
    borderRadius: 16,
    alignSelf: "center",
    padding: 5
  }
})