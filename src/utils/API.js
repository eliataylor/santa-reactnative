import axios from 'axios';
import Config from '../Config';
import {AsyncStorage} from 'react-native';


class API {

    constructor() {
      this.callqueue = [];

      axios.defaults.headers.common['crossDomain'] = true;
      axios.defaults.headers.common['async'] = true;
      axios.defaults.headers.common['timeout'] = 0; // for debugging with php breakpoints
      //axios.defaults.headers.common['Access-Control-Max-Age'] = 6000;
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
      this.requester = axios.create({
          baseURL: Config.api.base,
          timeout: Config.api.timeout,
          params: {
              '_format': 'json'
          }
      });
      var that = this;

      this.requester.interceptors.request.use(function (config) {
        that.callqueue.push(config);
        var tokens = that.getLocalTokens();
        if (tokens.access_token && config.url.indexOf('/oauth/token') !== 0) {
          config.headers.common['Authorization'] = 'Bearer ' + tokens.access_token;
        }
        return config;
      }, function(error) {
        console.log('ERROR ON INTERCEPTOR REQUEST', error);
        return Promise.reject(error);
      });

      this.requester.interceptors.response.use(res => {
        that.callqueue.shift();
        return res;
      }, error => {
        const statusCodes = {401:false,403:false};
        if (error.response && typeof statusCodes[error.response.status] !== 'undefined') {
          if (error.response.config.url === Config.api.base + '/oauth/token') {
            that.callqueue.shift(); // remove and reject
            console.log("Remove the interceptor to prevent a loop  in case token refresh also causes the 401");
          } else {
            console.log("REFRESH!");
            that.refreshToken.call(that);
          }
          return Promise.reject(error);
        }
        var next = that.callqueue.shift();
        return Promise.reject(next); // remove and run next
      });

      //this.requester = this.createAuthRefreshInterceptor.call(this, this.requester, this.refreshToken, {statusCodes: [401,403]});
      //this.requester = this.createAuthRefreshInterceptor(this.requester, this.refreshToken, {statusCodes: [401,403]});
    }

    createAuthRefreshInterceptor (axInstance, refreshTokenCall, options = {}) {
        const id = axInstance.interceptors.response.use(res => res, error => {

            // Reject promise if the error status is not in options.ports or defaults.ports
            const statusCodes = options.statusCodes;
            if (!error.response || (error.response.status && statusCodes.indexOf(+error.response.status) === -1)) {
                return Promise.reject(error);
            }

            if (error.response.config.url === Config.api.base + '/oauth/token') {
              console.log("Remove the interceptor to prevent a loop  in case token refresh also causes the 401");
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

      let tokens = await AsyncStorage.getItem(Config.api.tokName);
      try {
        tokens = JSON.parse(tokens);
        if (tokens === null || typeof tokens.access_token !== 'string') tokens = false;
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
           tokens.access_token = res.data.access_token;
           tokens.expires_in = res.data.expires_in;
           tokens.created_time = new Date().getTime();

           AsyncStorage.setItem(Config.api.tokName, JSON.stringify(tokens),  storage => {
             if (that.callqueue.length > 0) {
                var config = that.callqueue.shift(); // remove last
                config.headers.Authorization = 'Bearer ' + tokens.access_token;
                console.log("RESOLVE ORIGINAL REQUEST", config);
                //return that.requester.request(config); // this complete doesn't fire the onSucess callback for this request
                return Promise.resolve(config);
             }
             console.log("RESOLVING REFRESH POST");
             return Promise.resolve(config);
           })


       }).catch(err2 => {
          var msg = err2.response.data.message;
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
      try {
        tokens = JSON.parse(tokens);
        if (tokens === null || typeof tokens.access_token !== 'string') tokens = false;
      } catch(e) {
        tokens = false;
      }
      return tokens;
    }

    Get (path, config) {
        const call = this.requester.get(path, config);
        call.then((res) => {
          return res;
        }).catch((err) => {
          console.log('API', 'Response from "' + path + '": "' + err + '"');
          return Promise.reject(err);
        });
        return call;
    }

    Put (path, data) {
        console.log('API', 'Put to "' + path + '"');
        const call = this.requester.put(path, data);
        call.then((res) => {

            console.log('API', 'Response from "' + path + '":');
            console.log(res);
            return res;
        }).catch((err) => {
            console.log('API', 'Response from "' + path + '": "' + err + '"');
            return Promise.reject(err);
        });
        return call;
    }

    Post (path, data) {
        console.log('API', 'POST to "' + path + '"');
        const call = this.requester.post(path, data);
        call.then((res) => {
            return res;
        }).catch((err) => {
            console.log('API', 'Response from "' + path + '": "' + err + '"');
            return Promise.reject(err);
        });
        return call;
    }

    Request (req) {
        var path = req.url;
        console.log('API', 'REQUEST to "' + path + '"');
        const call = this.requester.request(req);
        call.then((res) => {
          return res;
        }).catch((err) => {
          console.log('API', 'Response from "' + path + '": "' + err + '"');
          return Promise.reject(err);
        });
        return call;
    }
}

export default (new API()); // singleton
