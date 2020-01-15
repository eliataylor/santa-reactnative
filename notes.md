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
adb shell am start -W -a android.intent.action.VIEW -d "https://santa-api.herokuapp.com/api/users/5d34ddb3bba83628da3b0a96/verify/aad0a30f0be8b6516c63e28bc916626eda7ae74f3dc6ec401e885dd7483f62642d6281eb013408786d1e5b010cbfe860" org.bethesanta.react

# server
heroku logs -n 200
heroku logs --tail
