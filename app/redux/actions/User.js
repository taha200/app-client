
export const TYPE_SAVE_LOGIN_DETAILS = "TYPE_SAVE_LOGIN_DETAILS"
export function saveUserDetailsInRedux(details) {
    return {
        type: TYPE_SAVE_LOGIN_DETAILS,
        value: details
    }
}

export const TYPE_SAVE_LOGIN_FCM = "TYPE_SAVE_LOGIN_FCM"
export function saveUserFCMInRedux(details) {
    return {
        type: TYPE_SAVE_LOGIN_FCM,
        value: details
    }
}
export function changeCity(city){
    return{
        type:"CHANGE_CITY",
        value:city
    }
}

export function getArray(arr){
    return{
        type:"GET_ARRAY",
        value:arr
    }
}
