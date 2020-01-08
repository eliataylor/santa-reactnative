const Config = {
    api: {
        //base: 'http://192.168.0.12:3000',
        //base: 'https://santa-api.herokuapp.com',
        base: 'http://santa-local.herokuapp.com:3000',
        timeout: 0, // Milliseconds
        base64d:process.env.OAUTH_BASE64,
        tokName : '@santaToken',
        gMapKey:process.env.GMAP_KEY,
    },
    android : {
      senderId : process.env.ANDROID_SENDER_ID
    }
};

export default Config;
