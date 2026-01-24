import { Platform } from "react-native";
import type { Auth } from "firebase/auth";

let auth: Auth;

if (Platform.OS === "web") {
  const mod = require("./firebase.web") as { auth: Auth };
  auth = mod.auth;
} else {
  const mod = require("./firebase.native") as { auth: Auth };
  auth = mod.auth;
}

export { auth };

