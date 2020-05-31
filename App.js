/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import { BASE_STACK_NAVIGATOR } from "./app/components/RootNavigator";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { userOperations } from "./app/redux/reducers/UserReducer";
import { navigationOperation } from "./app/redux/reducers/NavigationReducer";
import { checkoutDetailOperation } from "./app/redux/reducers/CheckoutReducer";
import firebase from "react-native-firebase";
import { View } from "react-native";
import { showDialogue } from "./app/utils/CMAlert";
import { StackActions, NavigationActions, createStackNavigator } from "react-navigation";
import { AsyncStorage } from "react-native";
import NavigationService from "./NavigationService";
import {
  NOTIFICATION_TYPE,
  DEFAULT_TYPE,
  ORDER_TYPE
} from "./app/utils/Constants";
import Wallet from "./app/containers/Wallet";
const rootReducer = combineReducers({
  userOperations: userOperations,
  navigationReducer: navigationOperation,
  checkoutReducer: checkoutDetailOperation
});

const eatanceGlobalStore = createStore(rootReducer);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.isNotification = undefined;
  }

  state = {
    isRefresh: false
  };

  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    fcmToken = await firebase.messaging().getToken();
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();

      this.getToken();
    } catch (error) {
      // User has rejected permissions
    }
  }

  componentWillUnmount() {
    try {
      this.notificationListener();
      this.notificationOpenedListener();
    } catch (error) { }
  }

  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const { title, body, data } = notification;
        

        // showDialogue(data,[], "");
        // this.showAlertNew1(body, data);
        console.log("NOTIFICATION TYPE :::::::::::::::: ", notification)

        if(data.screenType === "delivery"){
          showDialogue(body, [
            {
              text: "Cancel",
              onPress: () => {
                NavigationService.navigateToSpecificRoute("Order")
                // this.isNotification = "isDelivered"
                // this.setState({ isRefresh: this.state.isRefresh ? false : true },NavigationService.navigate("Order",{
                //   isAlert: true
                // }));
              }
            }
          ],
          () => {
            NavigationService.navigateToSpecificRoute("Order")
            // this.isNotification = "isDelivered"
            // this.setState({ isRefresh: this.state.isRefresh ? false : true },NavigationService.navigate("Order"));
          })
        }else{
          showDialogue(body, [], "",
          () => {
            
            if (data.screenType === "order") {
              // this.setState({ isRefresh: !this.state.isRefresh },NavigationService.navigate("Order"));
              NavigationService.navigateToSpecificRoute("Order")

              // NavigationService.navigate("Order",NavigationActions.navigate({ routeName: 'Home' }))
            }
            else if (data.screenType === "noti") {
              NavigationService.navigate("NotificationContainer");
            }

          })
        }
        

      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const { title, body, data } = notificationOpen.notification;

        if(data.screenType === "delivery"){
          showDialogue(body, [
            {
              text: "Cancel",
              onPress: () => {
                this.isNotification = "isDelivered"
                this.setState({ isRefresh: this.state.isRefresh ? false : true });
              }
            }
          ],
          () => {
            current
            this.isNotification = "isDelivered"
            this.setState({ isRefresh: this.state.isRefresh ? false : true });
          })
        }else{
          showDialogue(body, [], "",
          () => {
            
            if (data.screenType === "order") {
              
              NavigationService.navigateToSpecificRoute("Order")
              // this.setState({ isRefresh: !this.state.isRefresh },NavigationService.navigate("Order"));
              
            }
            else if (data.screenType === "noti") {

              // this.props.navigation.dispatch(
              //   StackActions.reset({
              //     index: 0,
              //     key: null,
              //     actions: [NavigationActions.navigate({ routeName: "Order" })]
              //   })
              // );
              // this.props.navigation.navigate("Order");
              // NavigationService.navigate("NotificationContainer");
              NavigationService.navigateToSpecificRoute("Order")
            }

          })
        }
        // this.showAlertNew1(body, data);
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {
        title,
        body,
        data,
        notificationId
      } = notificationOpen.notification;

      const lastNotification = await AsyncStorage.getItem("lastNotification");

      if (lastNotification !== notificationId) {
        if (data.screenType === "order") {
          this.isNotification = ORDER_TYPE;
          this.setState({ isRefresh: this.state.isRefresh ? false : true });
        } else if (data.screenType === "noti") {
          this.isNotification = NOTIFICATION_TYPE;
          this.setState({ isRefresh: this.state.isRefresh ? false : true });
        }
        await AsyncStorage.setItem("lastNotification", notificationId);
      }
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {
      //process data message
    });

    if (this.isNotification == undefined) {
      this.isNotification = DEFAULT_TYPE;
      this.setState({ isRefresh: this.state.isRefresh ? false : true });
    }
  }

  showAlertNew1(noti, data) {
    showDialogue(noti, [
      {
        text: "Ok",
        onPress: () => {
          if (data.screenType === "order") {
  //           // this.props.navigation.dispatch(
  //           //   StackActions.push({

  //           //     actions: [
  //           //       NavigationActions.navigate({ routeName: "Order" })
  //           //     ]
  //           //   })
  //           // );
  //           // this.props.navigation.navigate("Order");
            NavigationService.navigate("Order");
          } else if (data.screenType === "noti") {
            NavigationService.navigate("Notification");
  //           // this.props.navigation.navigate("Notification");
          }
        }
      }
    ]);
  }

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
  }

  render() {
    console.log("ISNOTIFICATION :::::::::::::: ", this.isNotification)
    return (
      <Provider store={eatanceGlobalStore}>
        {this.isNotification != undefined ? (
          <BASE_STACK_NAVIGATOR
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
            
            screenProps={this.isNotification}
          />
        ) : (
            <View />
          )}
      </Provider>
    );
  }
}

/*export default (DEFAULT_NAVIGATOR = createStackNavigator(
  {
    App: {
      screen: App
    }
  },
  {
    initialRouteName: "App",
    headerMode: "none"
  }
));*/
