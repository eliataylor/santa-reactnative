import EnvVars from './EnvVars';
import { Platform } from "react-native";

const Config = {
    api: {
        base: EnvVars.REACT_APP_API_URL, // set in .env.local
        client_id: EnvVars.REACT_APP_OAUTH2_ID,
        client_secret: EnvVars.REACT_APP_OAUTH2_SECRET,
        base64d : EnvVars.REACT_APP_BASE64,
        tokName: 'santaReact',
        timeout:30000
    },
    google: {
        key: (Platform.OS === 'ios') ? EnvVars.REACT_APP_GMAP_IOS : EnvVars.REACT_APP_GMAP_ANDROID,
        client:'364436864658-jdftfkif2diq5gl00n2l1tfka7rbbota.apps.googleusercontent.com',
        secret:'R0Aks08GBUav8OeimOg6p3RR'
    },
    android : {
        senderId : EnvVars.REACT_APP_ANDROID_SENDER_ID
    }
};

export default Config;
