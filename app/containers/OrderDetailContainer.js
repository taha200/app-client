import React from "react";
import { View, FlatList, Text, ScrollView, Modal,TouchableOpacity,Image } from "react-native";
import BaseContainer from "./BaseContainer";
import EDThemeButton from "../components/EDThemeButton";
import {
  getUserToken,
  getCartList,
  saveCartData,
  clearCartData
} from "../utils/AsyncStorageHelper";
import { showValidationAlert } from "../utils/CMAlert";
import {
  funGetDateStr,
  INR_SIGN,
  CART_PENDING_ITEMS
} from "../utils/Constants";
import { EDColors } from "../asse/Colors";
import PriceDetail from "../components/PriceDetail";
import ETextViewNormalLable from "../components/ETextViewNormalLable";
import OrderItem from "../components/OrderItem";
import asse from "../asse";
import { apiPost } from "../api/APIManager";
import { netStatus } from "../utils/NetworkStatusConnection";
import { ETFonts } from "../asse/FontConstants";
import {
  GET_RESTAURANT_DETAIL,
  RESPONSE_SUCCESS,
  RESPONSE_FAIL,
  ADD_REVIEW
} from "../utils/Constants";
import EditText from "../components/EditText";
import {Rating} from 'react-native-elements'
import { connect } from "react-redux";

class OrderDetailContainer extends React.Component {
  constructor(props) {
    super(props);
    var userObj = null;
    orderItem = this.props.navigation.state.params.OrderItem;
    this.state={
      reviewText:"",
      reviewStar:1,
      isReview:false
    }

  }

  componentDidMount() {
    this.checkUser();
  }
  checkUser() {
    getUserToken(
      success => {
        userObj = success;
      },
      failure => {
        showValidationAlert("Please Login");
      }
    );
  }
  addReview() {
    netStatus(status => {
      if (status) {
        this.setState({ isLoading: true });
        apiPost(
          ADD_REVIEW,
          {
            restaurant_id:this.props.navigation.state.params.resId,
            user_id: this.props.userID,
            rating: this.state.reviewStar,
            review: this.state.reviewText
          },
          response => {
            alert(JSON.stringify(response))

            if (response.error != undefined) {
              showValidationAlert(
                response.error.message != undefined
                  ? response.error.message
                  : Messages.generalWebServiceError
              );
              this.setState({ isLoading: false });
            } else {
              if (response.status == RESPONSE_SUCCESS) {
                // this.getRestaurantDetails();
                this.setState({ isLoading: false });
              } else {
                showValidationAlert(response.message);
                this.setState({ isLoading: false });
              }
            }
          },
          error => {}
        );
      } else {
        showValidationAlert(Messages.internetConnnection);
      }
    });
  }
  ratingComplete=(rating)=>{
   this.setState({
     reviewStar:rating
   })
  }
  render() {
    return (
      <BaseContainer
        title="Order Detail"
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}
      >
 <Modal
          visible={this.state.isReview}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            this.setState({ isReview: false });
          }}
        >
          <View style={{
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.50)"
  }}>
            <View style={{
    backgroundColor: "#fff",
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 4,
    marginTop: 20,
    marginBottom: 20
  }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontSize: 20,
                    flex: 1,
                    color: EDColors.primary,
                    alignSelf: "center",
                    textAlign: "center",
                    fontFamily: ETFonts.satisfy
                  }}
                >
                  Give Your Review
                </Text>
                <TouchableOpacity
                  style={{ alignSelf: "center" }}
                  onPress={() => {
                    this.setState({ isReview: false });
                  }}
                >
                  <Image
                    style={{ alignSelf: "center", height: 15, width: 15 }}
                    source={asse.ic_close}
                  />
                </TouchableOpacity>
              </View>

              {/* <Rating
                style={{ alignSelf: "center", marginTop: 10 }}
                imageSize={25}
                ratingCount={5}
                minValue={1}
                fractions={10}
                startingValue={parseInt(this.props.rating)}
                onFinishRating={star => {
                  this.reviewStar = star;
                }}
              /> */}
              <Rating
              ratingCount={5}
              imageSize={30}
              onFinishRating={this.ratingComplete}
              style={{ alignSelf: "center", marginTop: 10 }}

              />

              <View
                style={{
                  borderColor: "#000",
                  marginTop: 15,
                  marginLeft: 20,
                  marginRight: 20,
                 // borderBottomWidth:1
                }}
              >
                <EditText
                
                  placeholder="Write your comment"
                  style={{
                    color: "#000",
                    textAlignVertical: "top",
                    fontFamily: ETFonts.regular,
                    fontSize: 15
                  }}
                  onChangeText={newText => {
                   this.setState({
                     reviewText:newText
                   })
                  }}
                  maxLength={250}
                />
              </View>

              <Text
                style={{
                  alignSelf: "center",
                  fontFamily: ETFonts.bold,
                  paddingLeft: 30,
                  paddingRight: 30,
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderRadius: 6,
                  marginTop: 20,
                  color: "#fff",
                  backgroundColor: EDColors.primary
                }}
                onPress={() => {
                  this.addReview();
                  this.setState({ isReview: false });
                }}
              >
                SUBMIT
              </Text>
            </View>
          </View>
        </Modal>
        <ScrollView
            // showsVerticalScrollIndicator={false}
            // style={{ marginBottom: 10 }}
          >
        <View style={{ flex: 1 }}>
          <View
            style={{
              borderRadius: 6,
              backgroundColor: EDColors.white,
              margin: 10,
              padding: 2,
              paddingBottom:12

            }}
          >
            <View
              style={{
                margin: 5,
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  flex: 1,
                  color: EDColors.black,
                  fontSize: 16,
                  fontFamily: ETFonts.regular
                }}
              >
                {"Order No -" + orderItem.order_id}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  marginLeft: 5,
                  marginRight: 5,
                  fontFamily: ETFonts.regular
                }}
              >
                {funGetDateStr(orderItem.order_date, "DD-MMM")}
              </Text>

              <EDThemeButton
                label="REVIEW"
                buttonWidth={100}
                fontSizeNew={5}
                onPress={() => {
                  // this.storeData(orderItem);
                  this.setState({
                    isReview:true
                  })
                }}
              />
            </View>
            <Text
              style={{
                margin: 5,
                color: EDColors.black,
                fontSize: 12,
                fontFamily: ETFonts.regular
              }}
            >
              {"Status : " + orderItem.order_status}
            </Text>
            <FlatList
              data={orderItem.items}
              listKey={(item, index) => "Q" + index.toString()}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ flex: 1 }}>
                    <OrderItem
                      itemImage={item.image}
                      itemName={item.name}
                      quantity={"Qty: " + item.quantity}
                      price={INR_SIGN + " " + item.price}
                    />
                  </View>
                );
              }}
              keyExtractor={(item, index) => item + index}
            />
          </View>
          <View
            style={{
              borderRadius: 6,
              backgroundColor: EDColors.white,
              marginLeft: 10,
              marginRight: 10,
              padding: 2,
              paddingBottom:12
            }}
          >
            <ETextViewNormalLable text="Amount Paid" />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                marginTop: 5
              }}
            >
              <View
                style={{
                  backgroundColor: EDColors.black,
                  height: 0.5,
                  flex: 1,
                  alignSelf: "center",
                  marginLeft: 10,
                  marginRight: 10
                }}
              />
            </View>

            <FlatList
              data={orderItem.price}
              listKey={(item, index) => "Q" + index.toString()}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ flex: 1 }}>
                    <PriceDetail
                      title={item.label}
                      price={
                        item.label.includes("total") ||
                        item.label.includes("Total")
                          ? INR_SIGN + " " + item.value
                          : item.value
                      }
                    />
                  </View>
                );
              }}
              keyExtractor={(item, index) => item + index}
            />
          </View>
        </View>
        </ScrollView>
      </BaseContainer>
    );
  }

  storeData(data) {
    var cartData = {};

    getCartList(
      success => {
        if (success != undefined && success.resId == data.restaurant_id) {
          clearCartData(success => {
            cartData = {
              resId: data.restaurant_id,
              items: data.items,
              coupon_name: "",
              cart_id: 0
            };
            this.saveData(cartData);
          });
        } else {
          showValidationAlert(CART_PENDING_ITEMS);
        }
      },
      onCartNotFound => {
        cartData = {
          resId: data.restaurant_id,
          items: data.items,
          coupon_name: "",
          cart_id: 0
        };
        this.saveData(cartData);
      },
      error => {}
    );
  }

  saveData(data) {
    saveCartData(
      data,
      success => {
        this.props.navigation.popToTop()
        this.props.navigation.navigate("CartContainer");
      },
      fail => {}
    );
  }
}
export default connect(
  state => {
    return {
      userID: state.userOperations.userIdInRedux,
      token: state.userOperations.phoneNumberInRedux
    };
  },
  dispatch => {
    return {
   
    };
  }
)(OrderDetailContainer);
