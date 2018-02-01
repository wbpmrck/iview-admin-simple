
var config = require("../config/default");
import axios from 'axios';

axios.defaults.baseURL = config.dynamicDomain;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

exports.get = function (url,data) {
    
    return new Promise(function (resolve, reject) {
        // axios.get(config.dynamicDomain+url, {
        axios.get(url, {
            params: data
        }).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
            reject(error);
        });
    });
};
exports.post = function (url,data) {
   
    return new Promise(function (resolve, reject) {
        // axios.post(config.dynamicDomain+url, data).then(function (response) {
        axios.post(url, data).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
            reject(error);
        });
    });
}
