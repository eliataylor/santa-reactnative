import axios from 'axios';
import Config from '../Config';
import AsyncStorage from '@react-native-community/async-storage';

class API {

    constructor() {
      this.callqueue = [];
      axios.defaults.headers.common['crossDomain'] = true;
      axios.defaults.headers.common['async'] = true;
      axios.defaults.headers.common['timeout'] = 0; // for debugging with php breakpoints
      axios.defaults.headers.common['Accept'] = 'application/json';
      //axios.defaults.headers.common['Access-Control-Max-Age'] = 6000;
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
      this.requester = axios.create({
          baseURL: Config.api.base,
          timeout: Config.api.timeout
          //, params: {'_format': 'json'}
      });

      var that = this;
      this.requester.interceptors.request.use(async function (config) {
        that.callqueue.push(config); // TODO: key be config.url
        var tokens = await that.getLocalTokens();
        if (config.url.indexOf('/oauth/token') === 0) {
          config.headers.common['Authorization'] = 'Basic ' + Config.api.base64d;
        } else if (tokens && tokens.accessToken) {
          //console.log('ADDING BEARER TOKEN');
          config.headers.common['Authorization'] = 'Bearer ' + tokens.accessToken;
        }
        return config;
      }, function(error) {
        console.warn('ERROR ON INTERCEPTOR REQUEST', error);
        return Promise.reject(error);
      });

      this.requester.interceptors.response.use(res => {
        that.callqueue.shift(); // WARN: this could be removed out of order (we probably should)
        return res;
      }, error => { // errors might be old accessToken
        const statusCodes = {401:false,403:false};
        if (error.response && typeof statusCodes[error.response.status] !== 'undefined') {
          if (error.response.config.url === Config.api.base + '/oauth/token') {
            that.callqueue.shift(); // remove and reject
            console.warn("Remove the interceptor to prevent a loop  in case token refresh also causes the 401");
          } else {
            console.warn("REFRESH!");
            that.refreshToken.call(that);
          }
          return Promise.reject(error);
        }
        var next = that.callqueue.shift();
        return Promise.reject(error); // remove and run next
      });
    }

    createAuthRefreshInterceptor (axInstance, refreshTokenCall, options = {}) {
        const id = axInstance.interceptors.response.use(res => res, error => {
            console.warn("createAuthRefreshInterceptor");
            // Reject promise if the error status is not in options.ports or defaults.ports
            const statusCodes = options.statusCodes;
            if (!error.response || (error.response.status && statusCodes.indexOf(+error.response.status) === -1)) {
                return Promise.reject(error);
            }

            if (error.response.config.url === Config.api.base + '/oauth/token') {
              console.log("Remove the interceptor to prevent a loop in case token refresh also causes the 401");
            }
            axInstance.interceptors.response.eject(id);

            const refreshCall = refreshTokenCall(error);

            // Create interceptor that will bind all the others requests
            // until refreshTokenCall is resolved
            const requestQueueInterceptorId = axInstance.interceptors.request
                .use(
                  request => // user initiated
                  refreshCall.then((e) => // refresh if 401/403
                  request // user initiated
                ));

            // When response code is 401 (Unauthorized), try to refresh the token.
            return refreshCall.then((e) => {
                axInstance.interceptors.request.eject(requestQueueInterceptorId);
                return axInstance(error.response.config);
            }).catch(error => {
                axInstance.interceptors.request.eject(requestQueueInterceptorId);
                return Promise.reject(error)
            }).finally((e) =>
              this.createAuthRefreshInterceptor.call(this, axInstance, refreshTokenCall, options)
          );
        });
        return axInstance;
    }

    async refreshToken(err) {
      // @TODO if not a secured page >  return Promise.resolve();
      let tokens = false;
      try {
        console.warn('getting token ' + Config.api.tokName);
        token = await AsyncStorage.getItem(Config.api.tokName);
        tokens = JSON.parse(tokens);
        if (tokens === null || typeof tokens.accessToken !== 'string') tokens = false;
      } catch(e) {
        tokens = false;
      }
      if (!tokens || !tokens.refresh_token) {
        console.log("nothing to refresh");
        return Promise.resolve();
      }
      if (typeof tokens.refresh_error === 'string') {
        console.log("force new login??");
        return Promise.resolve();
      }

      var formData = new FormData();
      formData.append('grant_type', 'refresh_token');
      formData.append('refresh_token', tokens.refresh_token);
      formData.append('client_id', Config.api.client_id);
      formData.append('client_secret', Config.api.client_secret);

      var req = {
         url: Config.api.base + "/oauth/token", method: "POST",
         headers : {'Content-Type': `multipart/form-data; boundary=` + formData._boundary},
         data : formData,
       }
       const that = this;

       //this.requester.request(req).then(res => { // send with new axios instance, not as part of this.requester
       return axios.request(req).then(res => { // send with new axios instance, not as part of this.requester

           console.log("REFRESHED TOKENS", res.data);
           tokens.refresh_token = res.data.refresh_token;
           tokens.accessToken = res.data.accessToken;
           tokens.expires_in = res.data.expires_in;
           tokens.created_time = new Date().getTime();

           AsyncStorage.setItem(Config.api.tokName, JSON.stringify(tokens),  storage => {
             if (that.callqueue.length > 0) {
                var config = that.callqueue.shift(); // remove last
                config.headers.Authorization = 'Bearer ' + tokens.accessToken;
                console.log("RESOLVE ORIGINAL REQUEST", config);
                //return that.requester.request(config); // this complete doesn't fire the onSucess callback for this request
                return Promise.resolve(config);
             }
             console.log("RESOLVING REFRESH POST");
             return Promise.resolve(config);
           })


       }).catch(err2 => {
          var msg = that.getErrorMsg(err2);
          console.log(msg);
          tokens.refresh_error = msg;
          AsyncStorage.setItem(Config.api.tokName, JSON.stringify(tokens), storage => {
            if (document.location.pathname !== '/login') {
              document.location.href = '/login?reload=' + new Date().getTime();
            }
            console.log("REJECTING REFRESH POST");
            return Promise.reject(err2);
          });
       });
    }

    async getLocalTokens() {
      let tokens = await AsyncStorage.getItem(Config.api.tokName);
      if (!tokens || tokens === '') return false;
      try {
        tokens = JSON.parse(tokens);
        if (tokens === null || typeof tokens.accessToken !== 'string') tokens = false;
      } catch(e) {
        tokens = false;
      }
      return tokens;
    }

    Get (path, config) {
        const call = this.requester.get(path, config);
        return call;
    }

    Delete (path, config) {
        const call = this.requester.delete(path, config);
        return call;
    }

    Put (path, data) {
        console.log('API', 'Put to "' + path + '"');
        const call = this.requester.put(path, data);
        return call;
    }

    Post (path, data) {
        data = Object.entries(data)
          .map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`)
          .join('&');

        console.log('API', 'POST to "' + path + '"', data);
        const call = this.requester.post(path, data);
        return call;
    }

    Request (req) {
        var path = req.url;
        console.log('API', 'REQUEST to "' + path + '"');
        const call = this.requester.request(req);
        return call;
    }

    getErrorMsg(err) {
      if (err.response && err.response.data) {
          console.log(err.response.data);
          console.log(err.response.status);
          if (err.response.data.error) {
            return err.response.data.error;
          }
          if (typeof err.response.data.message === 'string') return err.response.data.message;
          return err.response.data;
        } else if (err.request) {
          console.log(err.request);
          return 'no server response from ' + Config.api.base;
        } else if (typeof err.message != 'undefined') {
          console.log('Error', err.message);
          return err.message;
        } else {
          console.log('Default Server Error', err);
          return err;
        }
    }

}

export default new API(); // singleton
