### Bringing the community together to fulfill the wishes of the homeless

This app is intended to bring the community together to fulfill the wishes of the homeless people on the streets. There are two users of the app namely The Santa and The Elf. The elf is any person walking on the street who has sometime to have a conversation with the homeless and enter their wish into the app. They enter the wish details including the location of the person and carry on in their lives. On submitting the wish, all the users that have the app will get notified as long as it matches their selected mile radius. The person who accepts to fulfill the wish then takes the role of Santa and walks to the location in the request thus fulfilling the wish.


- Terms & Conditions: https://www.fungiving.net/terms
- Privacy Policy: https://www.fungiving.net/terms



### To Build:
- `yarn install`
- create src/Config.js in the format
`const Config = {
  android : {
    senderId : 'your-android-sender-id'
  },
  api : {
    base64d : 'your-base46-encoded-oauth-string',
    base : 'https://example.com',
    tokName : 'some-token-name',
    timeout : 0,
    gMapKey : 'your-google-api-key'
  }
}
export default Config;
`
- `react-native run-android --verbose`
