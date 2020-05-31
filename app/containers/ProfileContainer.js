import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Switch
} from "react-native";
import BaseContainer from "./BaseContainer";
import EDThemeButton from "../components/EDThemeButton";
import asse from "../asse";
import { EDColors } from "../asse/Colors";
import EditText from "../components/EditText";
import { RESPONSE_SUCCESS, UPDATE_PROFILE } from "../utils/Constants";
import { getUserToken, saveUserLogin } from "../utils/AsyncStorageHelper";
import { apiPostQs } from "../api/ServiceManager";
import ProgressLoader from "../components/ProgressLoader";
import { showValidationAlert, showDialogue } from "../utils/CMAlert";
import { ETFonts } from "../asse/FontConstants";
import { Messages } from "../utils/Messages";
import ImagePicker from "react-native-image-picker";
import { netStatus } from "../utils/NetworkStatusConnection";

export default class ProfileContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      ImageSource: null,
      isNotification: false,
      firstName: "",
      lastName: "",
      PhoneNumber: "",
      txtFocus: false
    };
  }

  componentDidMount() {
    getUserToken(
      success => {
        userObj = success;
        this.setState({
          firstName: userObj.FirstName,
          lastName: userObj.LastName,
          PhoneNumber: userObj.PhoneNumber,
          isNotification: userObj.notification === "0" ? false : true
        });

        let source = { uri: userObj.image };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          ImageSource: userObj.image
        });
      },
      failure => {
        showValidationAlert(Messages.loginValidation);
      }
    );
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          ImageSource: response.uri
        });
      }
    });
  }
  updateData() {
    if (this.validate()) {
      this.updateProfile();
    }
  }

  validate() {
    if (this.state.firstName === "") {
      showValidationAlert(Messages.emptyName);
      return false;
    }
    // } else if (this.state.lastName === "") {
    //   showValidationAlert("Please enter last name");
    //   return false;
    // }
    return true;
  }

  updateProfile() {
    netStatus(status => {
      if (status) {
        this.setState({ isLoading: true });
        const data = new FormData();
        data.append("user_id", parseInt(userObj.UserID) || 0); // you can append anyone.
        if (
          this.state.ImageSource != undefined &&
          this.state.ImageSource != null &&
          this.state.ImageSource != "" && 
          !this.state.ImageSource.startsWith("http")  
        ) {
          const fileType = "jpg";

          data.append("image", {
            uri: this.state.ImageSource,
            name: `testPhotoName.${fileType}`,
            type: `image/${fileType}`
          });
        }
        data.append("token", "" + userObj.PhoneNumber);
        data.append("first_name", "" + this.state.firstName);
        data.append("last_name", "" + this.state.lastName);
        data.append("password", "1234");
        data.append("notification", this.state.isNotification ? "1" : "0");

        apiPostQs(
          UPDATE_PROFILE,
          data,
          resp => {
            if (resp != undefined) {
              if (resp.status == RESPONSE_SUCCESS) {
                saveUserLogin(
                  resp.profile,
                  success => {
                    this.setState({ isLoading: false });
                    this.props.navigation.goBack();
                  },
                  errAsyncStore => {}
                );
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
            console.log("error",err) 
            this.setState({ isLoading: false });
            showValidationAlert(Messages.generalWebServiceError);
          }
        );
      } else {
        console.log("error",err) 
        showValidationAlert(Messages.internetConnnection);
      }
    });
  }

  render() {
    return (
      <BaseContainer
        title="My Account"
        left="Back"
        right={[{ url: asse.tick }]}
        onRight={index => {
          index == 0 ? this.updateData() : null;
        }}
        onLeft={() => {
          this.props.navigation.goBack();
        }}
      >
        {this.state.isLoading ? <ProgressLoader /> : null}
        <View style={{ flex: 1 }}>
          <View
            style={{
              alignItems: "center"
            }}
          >
            <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
              <Image
                source={
                  this.state.ImageSource != undefined &&
                  this.state.ImageSource != null &&
                  this.state.ImageSource != ""
                    ? { uri: this.state.ImageSource }
                    : asse.user_placeholder
                }
                style={{
                  borderWidth: 2,
                  borderColor: EDColors.primary,
                  width: 130,
                  marginTop: 10,
                  height: 130,
                  backgroundColor: "#fff",
                  borderRadius: 65
                }}
              />

              <View style={{ position: "absolute" }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: EDColors.primary,
                    padding: 5,
                    borderRadius: 10,
                    marginTop: 100,
                    marginLeft: 110
                  }}
                >
                  <Image source={asse.camera_white} style={{}} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: ETFonts.bold,
                margin: 5
              }}
            >
              {(this.state.firstName || "") + " " + (this.state.lastName || "")}
            </Text>
          </View>
          <ScrollView>
            <View
              style={{
                backgroundColor: EDColors.white,
                borderRadius: 5,
                padding: 5,
                margin: 10
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 10,
                  marginBottom:10,
                  marginTop:10
                }}
              >
                <Image style={{ height: 20, width: 20 }} source={asse.call} />

                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: ETFonts.regular,
                    flex: 1,
                    marginLeft: 10
                  }}
                >
                  {"+91"+this.state.PhoneNumber}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 10,
                  alignItems: "center",
                  marginBottom:10,
                  marginTop:10
                }}
              >
                <Image style={{ height: 20, width: 20 }} source={asse.name} />

                <TextInput
                  style={{
                    fontSize: 16,
                    fontFamily: ETFonts.regular,
                    flex: 1,
                   
                    marginLeft: 10
                  }}
                  maxLength={40}
                  numberOfLines={1}
                  autoFocus={this.state.txtFocus}
                  placeholder={"Full Name"}
                  onChangeText={userText => {
                    this.setState({
                      firstName: userText
                    });
                  }}
                >
                  {this.state.firstName}
                </TextInput>

                <TouchableOpacity
                  onPress={() => this.setState({ txtFocus: true })}
                >
                  <Image source={asse.edit} />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 10,
                  marginBottom:10,
                  marginTop:10
                }}
              >
                <Image
                  style={{ height: 20, width: 20 }}
                  source={asse.our_address}
                />

                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: ETFonts.regular,
                    flex: 4,
                    marginLeft: 10
                  }}
                >
                  Our Address
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("AddressListContainer", {
                      isSelectAddress: false
                    })
                  }
                >
                  <Image source={asse.edit} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 10,
                  marginBottom:10,
                  marginTop:10

                }}
              >
                <Image
                  style={{ height: 25, width: 20 }}
                  source={asse.password}
                />

                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: ETFonts.regular,
                    flex: 1,
                    marginLeft: 10,
                    marginTop:5
                  }}
                >
                  Change Password
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("ChangePasswordContainer")
                  }
                >
                  <Image 
                  style={{marginTop:5}}
                  source={asse.edit} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  paddingLeft: 10,
                  paddingTop: 10,
                  marginBottom:10,
                  marginTop:10
                }}
              >
                <Image
                  style={{ height: 20, width: 20 }}
                  source={asse.notification}
                />
                <TouchableOpacity style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: ETFonts.regular,
                      flex: 1,
                      marginLeft: 10,
                    }}
                  >
                    Notification
                  </Text>
                </TouchableOpacity>
                <Switch
                style={{marginBottom:10,marginEnd:5}}
                  value={this.state.isNotification}
                  onValueChange={value =>
                    this.setState({ isNotification: value })
                  }
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </BaseContainer>
    );
  }
}
