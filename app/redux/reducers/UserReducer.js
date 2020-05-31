import { TYPE_SAVE_LOGIN_DETAILS, TYPE_SAVE_LOGIN_FCM } from "../actions/User";

const initialStateUser = {
  // LOGIN DETAILS
  phoneNumberInRedux: undefined,
  userIdInRedux: undefined,
  userCity:undefined,
  resArr:undefined
};

export function userOperations(state = initialStateUser, action) {
  switch (action.type) {
    case TYPE_SAVE_LOGIN_DETAILS: {
      return Object.assign({}, state, {
        phoneNumberInRedux: action.value.PhoneNumber,
        userIdInRedux: action.value.UserID,
        userCity:action.value.city
      });
    }
    case TYPE_SAVE_LOGIN_FCM: {
      return Object.assign({}, state, {
        token: action.value
      });
    }
    case "CHANGE_CITY":{

      // return Object.assign({},state,{
      //   userCity:action.value
      // })
      return {
        ...state,
        userCity:action.value
      }
    }
    case "GET_ARRAY":{
      return Object.assign({}, state, {
        resArr: action.value
      });
    }

    // case SAVE_CART_COUNT: {
    //   return Object.assign({}, state, {
    //     cartCount: action.value
    //   });
    // }
    default:
      return state;
  }
}
