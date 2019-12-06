keytool -genkeypair -v -keystore santa4homeless.keystore -alias santa4homeless -keyalg RSA -keysize 2048 -validity 10000


adb devices -l
adb -s ce071717d3054a2a027e reverse tcp:8081 tcp:8081
adb reverse tcp:8081 tcp:8081
adb shell input keyevent 82

10.0.0.187
http://192.168.0.12:8081/index.bundle?platform=android&dev=true&minify=false

http://localhost:8081/debugger-ui/

sudo lsof -i :8081
kill -9 34031

$reactNative.AsyncStorage.clear();

cd /Developer/santa/ReactSanta/android/app/release
for file in *.apk; do adb install $file; done


openssl req -newkey rsa:2048 -x509 -nodes \
    -keyout santa-local.herokuapp.com.key \
    -new \
    -out santa-local.herokuapp.com.crt \
    -subj /CN=santa-local.herokuapp.com \
    -reqexts SAN \
    -extensions SAN \
    -config <(cat /System/Library/OpenSSL/openssl.cnf \
        <(printf '[SAN]\nsubjectAltName=DNS:santa-local.herokuapp.com')) \
    -sha256 \
    -days 3650

    sudo openssl rsa -in santa-local.herokuapp.com.key -out santa-local.herokuapp.com.nopass.key
