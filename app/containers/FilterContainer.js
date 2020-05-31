import React from "react";
import { View, StyleSheet } from "react-native";
import RadioGroupWithHeader from "../components/RadioGroupWithHeader";
import BaseContainer from "./BaseContainer";
import ETSlider from "../components/ETSlider";
import TextviewRadius from "../components/TextviewRadius";
import { Dropdown } from 'react-native-material-dropdown';
import { saveUserDetailsInRedux, saveUserFCMInRedux,changeCity,getArray } from "../redux/actions/User";
import { connect } from "react-redux";
import { netStatus } from "../utils/NetworkStatusConnection";
import { apiPost } from "../api/ServiceManager";
import {
  GOOGLE_API_KEY,
  REGISTRATION_HOME,
  RESPONSE_SUCCESS,
  SEARCH_PLACEHOLDER,
  CHANGE_TOKEN
} from "../utils/Constants";


class FilterContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.cookTime = this.props.navigation.state.params.time || 30;
    this.recipeType = this.props.navigation.state.params.food;
    this.distance = this.props.navigation.state.params.distance || 5;
    this.priceType = this.props.navigation.state.params.price;
  }

  state = {
    foodType: [
      {
        label: "Both",
        size: 15,
        selected: this.props.navigation.state.params.food === "" ? true : false
      },
      {
        label: "Veg",
        size: 15,
        selected: this.props.navigation.state.params.food == 1 ? true : false
      },
      {
        label: "Non-Veg",
        size: 15,
        selected: this.props.navigation.state.params.food == 0 ? true : false
      }
    ],
    priceSort: [
      {
        label: "High to low",
        size: 15,
        selected: this.props.navigation.state.params.price == 1 ? true : false
      },
      {
        label: "Low to High",
        size: 15,
        selected: this.props.navigation.state.params.price == 0 ? true : false
      }
    ],
    sendFilterDetailsBack: this.props.navigation.state.params.getFilterDetails,
    filterType: this.props.navigation.state.params.filterType,
    city:""
  };

  applyFilter(data) {
    if (this.state.sendFilterDetailsBack != undefined) {
      this.state.sendFilterDetailsBack('','','');
      
    }
  }
  loadData(lat, long, searchText) {
   
    let param = {
      latitude:"",
      longitude:"",
      itemSearch: searchText,
      token: headerPhoneNum,
      food: "",
      distance: "" ,
      city:this.state.city
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
                this.props.change(resp)
                alert(JSON.stringify(this.props.resarray))

                this.props.navigation.goBack();
                 
                this.arrayRestaurants = this.props.resarray.restaurant;
                this.arrayCategories = this.props.resarray.category;
                this.arraySlider = this.props.resarray.slider;
                      this.state.sendFilterDetailsBack(this.arrayRestaurants,this.arrayCategories,this.arraySlider);

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
  render() {
    let data = [{
      value: 'Karachi',
    }, {
      value: 'Islamabad',
    }, {
      value: 'Lahore',
    }];
    return (
      <BaseContainer
        title="Filter"
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}
      >
        <View style={{ flex: 8,width:"80%",marginLeft:25 }}>
     
        <Dropdown
        label='Select City'
        data={data}
        onChangeText={(e)=>{
         var a= e.toLowerCase()
          this.setState({
            city:a
          })
        }}
      />
            {/* <ETSlider
              title="Sort By Distance"
              onSlide={values => {
                this.distance = values;
              }}
              max={5}
              initialValue={this.distance}
              valueType="km"
            /> */}
           
            {/* <RadioGroupWithHeader
              data={this.state.priceSort}
              title="Sort By Price"
              onSelected={selected => {
                this.priceType = selected;
              }}
            /> */}
          
        </View>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            flex: 1
          }}
        >
          <TextviewRadius
            text="APPLY FILTER"
            onPress={() => {
              // if (this.state.filterType == "Main") {
              //   var data = {
              //     food:
              //       this.recipeType == "Veg"
              //         ? 1
              //         : this.recipeType == "Non-Veg"
              //         ? 0
              //         : "",
              //     distance: this.distance != "" ? this.distance : ""
              //   };
              //   this.applyFilter(data);
              // } else if (this.state.filterType == "Recipe") {
              //   var data = {
              //     food:
              //       this.recipeType == "Veg"
              //         ? 1
              //         : this.recipeType == "Non-Veg"
              //         ? 0
              //         : "",
              //     timing: this.cookTime != "" ? this.cookTime : ""
              //   };
              //   this.applyFilter(data);
              // } else {
              //   var data = {
              //     food:
              //       this.recipeType == "Veg"
              //         ? 1
              //         : this.recipeType == "Non-Veg"
              //         ? 0
              //         : "",
              //     price: this.priceType == "High to low" ? 1 : 0
              //   };
              // }
               this.loadData('','','')
            }}
          />
          <TextviewRadius
            text="RESET"
            onPress={() => {
              if (this.state.filterType == "Main") {
                var data = {
                  food: "",
                  distance: ""
                };
                this.applyFilter(data);
              } else if (this.state.filterType == "Recipe") {
                var data = {
                  food: "",
                  timing: ""
                };
                this.applyFilter(data);
              } else {
                var data = {
                  food: "",
                  price: 0
                };
              }
              this.applyFilter(data);
            }}
          />
        </View>
      </BaseContainer>
    );
  }
}
export default connect(
  state => {
    return {
      resarray:state.userOperations.resArr

    };
  },
  dispatch => {
    return {
      change: detailsToSave => {
        dispatch(getArray(detailsToSave));
      }
    };
  }
)(FilterContainer);

export const style = StyleSheet.create({
  container: {
    flex: 1
  }
});
