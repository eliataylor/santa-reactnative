keytool -genkeypair -v -keystore santa4homeless.keystore -alias santa4homeless -keyalg RSA -keysize 2048 -validity 10000


adb devices
adb -s <device name> reverse tcp:8081 tcp:8081
adb shell input keyevent 82
