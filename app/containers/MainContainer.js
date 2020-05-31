import React from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Modal,
  StyleSheet
} from "react-native";
import Geocoder from "react-native-geocoding";
import {
  GOOGLE_API_KEY,
  REGISTRATION_HOME,
  RESPONSE_SUCCESS,
  SEARCH_PLACEHOLDER,
  CHANGE_TOKEN
} from "../utils/Constants";
import asse from "../asse";
import BaseContainer from "./BaseContainer";
import HomeCategoryCard from "../components/HomeCategoryCard";
import PopularRestaurantCard from "../components/PopularRestaurantCard";
import { apiPost } from "../api/ServiceManager";
import { EDColors } from "../asse/Colors";
import ETextViewNormalLable from "../components/ETextViewNormalLable";
import { getUserToken, getCartList } from "../utils/AsyncStorageHelper";
import { showValidationAlert, showDialogue } from "../utils/CMAlert";
import { connect } from "react-redux";
import { saveNavigationSelection } from "../redux/actions/Navigation";
import {getArray} from "../redux/actions/User"
import { saveCartCount } from "../redux/actions/Checkout";
import {CheckBox,Button} from 'react-native-elements'

import BannerImages from "../components/BannerImages";
import DataNotAvailableContainer from "../components/DataNotAvailableContainer";
import { netStatus } from "../utils/NetworkStatusConnection";
import { Messages } from "../utils/Messages";
import { ETFonts } from "../asse/FontConstants";
import { Dropdown } from 'react-native-material-dropdown';
import TextviewRadius from "../components/TextviewRadius";


class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    headerPhoneNum = "";
    strSearch = "";
    this.foodType = "";
    this.distance = "";
    this.modelSelected = "";
    this.arrayRestaurants;
    this.arrayCat=[{name:"All Categories",image:"https://asiasociety.org/sites/default/files/styles/1200w/public/2019-02/%EB%B0%98%EC%B0%AC.jpg"}];
    this.arraySlider;
    this.arrayCategories;
    // this.count = 0;
  }

  state = {
    latitude: 0.0,
    longitude: 0.0,
    error: null,
    isLoading: false,
    strAddress: null,
    isNetConnected: true,
    count: 0,
    visible:false,
    applyCity:false,
    city:"",
    byname:true,
    bytags:false,
    nama:false,
    query:""
  };

  async componentDidMount() {

    this.changeTokenAPI()
    getUserToken(
      success => {
        headerPhoneNum = success.PhoneNumber;

      },
      failure => { }
    );
    this.loadData(
     "" ,
     "",
      ""
    );
    // this.getLatLong();
  }

  changeTokenAPI = () => {
    let params = {
      token: this.props.phoneNumber,
      user_id: this.props.userIdFromRedux,
      firebase_token: this.props.token
    }
    apiPost(
      CHANGE_TOKEN,
      params,
      success => {
        console.log("Change Token success ::::::::::: ", success)
      },
      failure => {
        console.log("Change Token failure ::::::::::: ", failure)
      }

    )
  }
 getResByCity=()=>{
      fetch(`http://doofy.thinksolutionz.org/v1/api/getRestaurantByCity/karachi`,{
        method:"GET"
      }).then(res=>res.json()).then(data=>alert(JSON.stringify(data))).catch((err)=>alert(err))
 }
  getLatLong = () => {
    netStatus(status => {
      if (status) {
        Geocoder.init(GOOGLE_API_KEY);
        this.setState({ isLoading: true });
        navigator.geolocation.getCurrentPosition(
          position => {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null
            });

         
            console.log("LATITUDE ::::::::::::::: ", position.coords.latitude)
          },
          error => {
            console.log("ERRRORR :::::::::::::::::: ", error)
            this.setState({ isLoading: false });
            this.setState({ error: error.message });
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
        );
      } else {
        showValidationAlert(Messages.internetConnnection);
      }
    });
  }
  loadData=(lat, long, searchText)=> {
    const param = {
      latitude:"",
      longitude:"",
      itemSearch:(searchText==="All Categories")?"":searchText,
      token: headerPhoneNum,
      food: "",
      distance: "" ,
      city:(this.state.applyCity)?this.state.city:this.props.userCity
    }
    console.log("HOME PARAMETER :::::::::::: ", param)
    netStatus(status => {
      if (status) {
        this.setState({ isLoading: true });
       

        apiPost(
          REGISTRATION_HOME,
          param,
          resp => {
            if (resp != undefined) {
              if (resp.status == RESPONSE_SUCCESS) {
                this.arrayRestaurants = resp.restaurant;
                // this.arrayCategories = resp.category;
                this.arrayCategories=this.arrayCat.concat(resp.category)

                this.arraySlider = resp.slider;
                this.setState({ isLoading: false });
              } else {
                showValidationAlert(resp.message);
                this.setState({ isLoading: false });
              }
            } else {
              showValidationAlert(Messages.generalWebServiceError);
              this.setState({ isLoading: false });
            }
          },
          err => {
            this.setState({ isLoading: false });
            showValidationAlert(err.message || Messages.generalWebServiceError);
          }
        );
      } else {
        showValidationAlert(Messages.internetConnnection);
      }
    });
  }

  testFunction = data => {
  
    this.loadData(this.state.latitude, this.state.longitude, "");
  };

  refreshScreen = () => {
    this.loadData(this.state.latitude, this.state.longitude, "");
  };

  rightClick = index => {
    if (this.state.count > 0) {
      if (index == 0) {
        this.props.navigation.navigate("CartContainer");
      } else if (index == 1) {
        this.setState({
          visible:true
        })
        // this.props.navigation.navigate("Filter", {
        //   getFilterDetails: this.loadData,
        //   filterType: "Main",
        //   food: this.foodType,
        //   distance: this.distance
        // });
      }
    } else {
      this.setState({
        visible:true
      })
      // if (index == 0) {
      //   this.props.navigation.navigate("Filter", {
      //     getFilterDetails: this.testFunction,
      //     filterType: "Main",
      //     food: this.foodType,
      //     distance: this.distance
      //   });
      // }
    }
  };
   searchByTags=()=>{
     fetch(`http://doofy.thinksolutionz.org/v1/api/search/ccd`,{
       method:"GET",
     headers:{"Content-Type" : "application/json"}
}).then(res=>{res.json()}).then(data=>alert(JSON.stringify(data))).catch((err)=>alert(err))
   }
  render() {
    let data = [{
      value: 'Karachi',
    }, {
      value: 'Islamabad',
    }, {
      value: 'Lahore',
    }];
    this.props.navigation.addListener("didFocus", payload => {
  
      getCartList(
        success => {
          console.log("success", success);
          if (success != undefined) {
            var count=0
            if(success.length>0){
              success.map(item=>{
                item.items.map(item=>{
                   count = count + item.quantity;

                })
                  this.props.saveCartCount(count);

              })
              this.setState({
                count:count
              })
            }
            else if (success.length == 0) {
                this.props.saveCartCount(0);
                this.setState({ count: 0 });
              }
            // console.log("success if", success);
            // cartData = success.items;
            // if (cartData.length > 0) {
            //   this.count = 0;
            //   cartData.map((item, index) => {
            //     console.log("count", this.count);
            //     this.count = this.count + item.quantity;
            //     console.log("count---->>>", this.count);
            //   });

            //   console.log("count final", this.count);
            //   this.setState({ count: this.count });
            //   //this.props.saveCartCount(count);
            // } else if (cartData.length == 0) {
            //   //this.props.saveCartCount(0);
            //   this.setState({ count: 0 });
            // }
          } else {
          }
        },
        onCartNotFound => { 
          // alert(JSON.stringify(onCartNotFound))

        },
        error => {
          // alert(JSON.stringify(error))

         }
      );
      this.props.saveNavigationSelection("Home");
    });

    return (
      <BaseContainer
        title="Home"
        left="Menu"
        //right={[{ url: asse.ic_filter }]}
        right={
          this.state.count > 0
            ? [
              {
                url: asse.ic_cart,
                name: "Cart",
                value: this.state.count
              },
              { url: asse.ic_filter, name: "filter" }
            ]
            : [{ url: asse.ic_filter, name: "filter" }]
        }
        onLeft={() => {
          this.props.navigation.openDrawer();
        }}
        onRight={this.rightClick}
        loading={this.state.isLoading}
      >
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
                      fontSize: 30
                    }}
                  >
                    Filter
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

                <Dropdown
        label='Select City'
        data={data}
        onChangeText={(e)=>{
         var a= e.toLowerCase()
          this.setState({
            city:a
          })
        }}
        containerStyle={{marginTop:10}}
      />
      <View style={{flexDirection:"row",justifyContent:"center",marginTop:10}}>
<CheckBox
containerStyle={{width:"45%"}}
  checkedColor={EDColors.primary}
  title='Search by tags'
  checkedIcon='dot-circle-o'
  uncheckedIcon='circle-o'
  checked={this.state.bytags}
  onPress={()=>{
    this.setState({
      bytags:true,
      byname:false
    })
  }}
/>
<CheckBox
containerStyle={{width:"45%"}}
  checkedColor={EDColors.primary}
  title='Search by name'
  checkedIcon='dot-circle-o'
  uncheckedIcon='circle-o'
  checked={this.state.byname}
  onPress={()=>{
    this.setState({
      bytags:false,
      byname:true
    })
  }
  }
/>


</View>
<View style={{justifyContent:"center",alignItems:"center"}}>
  <Button title="APPLY FILTER" buttonStyle={{backgroundColor:EDColors.primary,width:"43%",borderRadius:8,marginTop:30}} onPress={()=>{this.setState({
    applyCity:true,
    visible:false,
    isLoading:true
  })
  if(this.state.bytags){
   this.setState({
     nama:true
   })
  }
  else{
    this.setState({
      nama:false
    })
  }
  setTimeout(()=>{
    this.loadData(this.state.latitude,this.state.longitude,"")

  },3000)
  }}/>
</View>
              </View>
            </View>
          </Modal>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                {console.log("image array", this.arraySlider)}
                {this.arraySlider != undefined ? (
                  <BannerImages images={this.arraySlider} />
                ) : (
                    <Image
                      source={asse.bgHome}
                      style={{
                        alignItems: "center",
                        width: "100%",
                        height: 180
                      }}
                    />
                  )}

                <View
                  style={{
                    backgroundColor: "white",
                    marginLeft: 15,
                    marginRight: 15,
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    position: "absolute",
                    marginTop: 155
                  }}
                >
                  <View
                    style={{
                      paddingLeft: 5,
                      paddingRight: 5,
                      backgroundColor: EDColors.primary,
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottomStartRadius: 5,
                      borderTopStartRadius: 5
                    }}
                  >
                    <Image source={asse.ic_location} style={{ margin: 10 }} />
                  </View>

                  <View
                    style={{ flexDirection: "row", paddingLeft: 5, flex: 1 }}
                  >
                    <TextInput
                      style={{ fontFamily: ETFonts.regular, fontSize: 12 }}
                      numberOfLines={1}
                      placeholder={(this.state.nama)?"Search by tags":SEARCH_PLACEHOLDER}
                      style={{
                        flex: 5
                      }}
                      onChangeText={newText => {
                        this.setState({
                          query:newText
                        })
                      }}
                      returnKeyType="done"
                    />
                    <TouchableOpacity
                      style={{
                        paddingRight: 8
                      }}
                      onPress={() => {
                        {(this.state.nama)?
                        this.searchByTags()
                        :
                        this.loadData(
                          this.state.latitude,
                          this.state.longitude,
                          this.state.query
                        );
                        }
                       
                        this.modelSelected = "";
                      }}
                    >
                      <Image
                        source={asse.ic_search}
                        resizeMode="contain"
                        style={{
                          flex: 1,
                          width: 20,
                          height: 20,
                          alignSelf: "center"
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            {/* <ButtonGroup
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{marginTop:25}}
            /> */}
            <FlatList
              style={{ marginTop: 30, marginStart: 10, marginEnd: 10 }}
              horizontal
              extraData={this.state}
              data={this.arrayCategories}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item + index}
              renderItem={(item, index) => {
                return (
                  <HomeCategoryCard
                    categoryObjModel={item}
                    onPress={model => {
                      
                      this.loadData(
                        this.state.latitude,
                        this.state.longitude,
                        item.item.name
                      );
                    
                    
                      this.modelSelected = item.item.name;
                    }}
                    isSelected={
                      this.modelSelected == item.item.name ? true : false
                    }
                  />
                );
              }}
            />

            {this.arrayRestaurants != undefined &&
             this.arrayRestaurants != null &&
             this.arrayRestaurants.length > 0 ? (
                <View>
                  <ETextViewNormalLable text="Popular Restaurants" />
                  <FlatList
                    style={{ margin: 5 }}
                    data={this.arrayRestaurants}
                    extraData={this.state}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => item + index}
                    renderItem={(item, index) => {
                      return (
                      //  alert(JSON.stringify(item.item.timings.off))
                        (item.item.timings.off==="close")?(
                          <PopularRestaurantCard
                          restObjModel={item}
                          onPress={restObjModel => {
                            this.props.navigation.navigate(
                              "RestaurantContainer",
                              {
                                refresh: this.refreshScreen,
                                restId: restObjModel.restuarant_id,
                                status:false,
                              }
                            );
                          }}
                        />
                        ):(
                          <PopularRestaurantCard
                          restObjModel={item}
                          onPress={restObjModel => {
                            this.props.navigation.navigate(
                              "RestaurantContainer",
                              {
                                refresh: this.refreshScreen,
                                restId: restObjModel.restuarant_id,
                                status:true,
                              }
                            );
                          }}
                        />
                        )
                       
                      );
                    }}
                  />
                </View>
              ) : this.arrayRestaurants != undefined &&
                this.arrayRestaurants != null &&
                this.arrayRestaurants.length == 0 ? (
                  <DataNotAvailableContainer />
                ) : (
                  // <View />
                  <View style = {{flex:1}}>
                    {this.state.isLoading ? null :
                  <TouchableOpacity style = {{alignSelf:'center',backgroundColor:EDColors.primary,padding:10, marginVertical:100}} onPress = {()=>this.getLatLong()}>
                    {/* <Image
                    source = {asse.refresh}/> */}
                    <Text style = {{color:EDColors.white}}>
                      Reload
                    </Text>
                  </TouchableOpacity>
                  }
                  </View>
                )}
          </ScrollView>
        </View>
      </BaseContainer>
    );
  }
}

export default connect(
  state => {
    console.log("STATE VALUE :::::::::: ", state)
    return {
      userIdFromRedux: state.userOperations.userIdInRedux,
      token: state.userOperations.token,
      phoneNumber: state.userOperations.phoneNumberInRedux,
      userCity:state.userOperations.userCity,
      resarray:state.userOperations.resArr
    };
  },
  dispatch => {
    return {
      saveNavigationSelection: dataToSave => {
        dispatch(saveNavigationSelection(dataToSave));
      },
      saveCartCount: data => {
        dispatch(saveCartCount(data));
      },
      getRes: data =>{
       dispatch(getArray(data))
      }

    };
  }
)(MainContainer);
export const style = StyleSheet.create({
 
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.50)",
   
  },
  
  modalSubContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 6,
    width: Dimensions.get("window").width - 40,
    height: Dimensions.get("window").height - 320,
    marginTop: 20,
    marginBottom: 20
  }
  
})