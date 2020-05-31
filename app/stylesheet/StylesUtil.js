import { StyleSheet } from "react-native";
import { EDColors } from "../asse/Colors";
import { ETFonts } from "../asse/FontConstants";

export const Style = StyleSheet.create({
  loginBlankView: { flex: 4 },
  loginView: {
    color: "#fff",
    marginLeft: 25,
    marginRight: 25
  },
  textview: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
    fontFamily: ETFonts.regular
  },
  textviewNormal: {
    color: "black",
    fontSize: 18,
    
    fontFamily: ETFonts.regular
  }
});
