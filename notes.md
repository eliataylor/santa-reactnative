## dev tools
http://192.168.0.12:8081/index.bundle?platform=android&dev=true&minify=false
http://localhost:8081/debugger-ui/
sudo lsof -i :8081
kill -9 34031
$reactNative.AsyncStorage.clear();


## Android tools
adb devices -l
adb -s ce071717d3054a2a027e reverse tcp:8081 tcp:8081
adb reverse tcp:8081 tcp:8081
adb shell input keyevent 82

# test deep linking:
adb shell am start -W -a android.intent.action.VIEW -d "https://www.fungiving.net/users/5f31d5e487ff0f00048006f1/verify/b08d1cf31bed28998037e36d4f0d98a6958213d6ddb563b4b403fe90d516a91efa08e06cafcb638d8aca78df5839acbc" org.bethesanta.react

xcrun simctl openurl booted https://www.fungiving.net/users/5d34ddb3bba83628da3b0a96/verify/aad0a30f0be8b6516c63e28bc916626e008062a34dc144d961ea1935af7072c37c9f06168e9eaff5e2e3cc38b9e2b326



# server
heroku logs -n 200
heroku logs --tail

# push notifications to ios
xcrun simctl push booted test_push.apns
