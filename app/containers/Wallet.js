import React from "react";
import {
    View,
    Text,
    SectionList,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    FlatList,
    Dimensions,
    Platform,
    Linking,

} from "react-native";
import {Header,Icon} from 'react-native-elements'
import { EDColors } from "../asse/Colors";
import { apiPost } from "../api/APIManager";
import {
  CHECK_WALLET
} from "../utils/Constants";
import { getUserToken, saveUserLogin } from "../utils/AsyncStorageHelper";
import BaseContainer from "./BaseContainer";
import { ETFonts } from "../asse/FontConstants";

export default class Wallet extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      amount:0
    };
  }
  componentDidMount(){
    getUserToken(
      success => {
        userObj = success;
        let param = {
          user_id:userObj.UserID
        }
        this.setState({isLoading:true})
        this.interval = setInterval(() =>{
          apiPost(
            CHECK_WALLET,
            param,
            onSuccess => {
                console.log("CHECK API SUCCESS ::::::: ", onSuccess)
                if(onSuccess.status === 0){
                 // this.setState({isLoading: false})
                 // alert("Please select pickup option delivery service is not available at this moment")
                }else{
                  this.setState({amount:onSuccess.wallet.amount,isLoading:false})
                }
                
            },
            onFailure => {
              console.log("CHECK API FAILURE ::::::: ", onFailure)
              this.setState({isLoading: false})
            }
      
          )
        }, 1000);
      },
      failure => {
        showValidationAlert(Messages.loginValidation);
      }
    );

  }
  

    render(){
        return(
        <BaseContainer
        title="My Wallet"
        left="Menu"
        right={[]}
        onLeft={() => {
          this.props.navigation.openDrawer();
        }}
        loading={this.state.isLoading}
        
      >
        <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
        <View style={{alignSelf:"center",width:"50%",height:"30%",backgroundColor:"#4464ac",borderRadius:100,marginTop:10,alignItems:'center',justifyContent:'center'}}>
        <Text style={{textAlign:'center',fontSize:45,fontFamily:ETFonts.satisfy,color:"white"}}>Balance</Text>
{(this.state.isLoading===false)?
        <Text style={{textAlign:'center',fontSize:35,fontFamily:ETFonts.satisfy,color:"white"}}>Rs. {this.state.amount}</Text>

:
null
}

        </View>
       <View style={{width:"100%",alignItems:'center',marginTop:15}}>
        
       <Text style={{textAlign:'center',fontSize:40,fontFamily:ETFonts.satisfy,color:"black"}}></Text>

        
   

       </View>
       </View>
       </BaseContainer>
        );
    }
}