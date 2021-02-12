/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-xxx' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
    document.getElementById('bb').onclick = uploadFiles; 
    console.log('Running cordova-xxx' , uploadFiles);

}

async function callWebApiViaXHR(options) {
    if (!options) { options = {}; }

    let apiUrl = 'http://192.168.0.112:5995/test/upload';
    if(window.WebviewProxy && window.WebviewProxy.convertProxyUrl){
        apiUrl = `${window.WebviewProxy.convertProxyUrl(apiUrl)}`;
    }
    var xhr = new XMLHttpRequest();
    //xhr.file = file; // not necessary if you create scopes like this
    xhr.addEventListener('progress', function(e) {
        var done = e.position || e.loaded, total = e.totalSize || e.total;
        console.log('xhr progress: ' + (Math.floor(done/total*1000)/10) + '%');
    }, false);
    if ( xhr.upload ) {
        xhr.upload.onprogress = function(e) {
            var done = e.position || e.loaded, total = e.totalSize || e.total;
            console.log('xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done/total*1000)/10) + '%');
        };
    }
    xhr.onreadystatechange = function(e) {
        if ( 4 == this.readyState ) {
            console.log(['xhr upload complete', e]);
        }
    };
    xhr.open('post', apiUrl, true);
    xhr.setRequestHeader("Content-Type","multipart/form-data");
    xhr.send(options.data);

    // return Axios({
    //     ...options,
    //     url: apiUrl,
    //     withCredentials: true,
    //     // credentials: 'include',
    //     // crossdomain: true,
    //     // mode: 'cors',
    // })
    //     .then(response => {
    //         if (response && response.status == 401) {
    //             console.error('[DataService::callWebApiViaXHR] Web api call error: ', response);                
    //         }            
    //     }).catch(err => {
    //         console.error(err);
    //         return {
    //             success: false,
    //             message: err && err.message,
    //         }
    //     });
}

async function uploadFiles(){
    try {
        let data = new FormData(),
            xxFile = document.getElementById('xx');

        for (let index = 0; index < xxFile.files.length; index++) {
            const file = xxFile.files[index];
            data.append(`file${index}`, file);
        }
        await callWebApiViaXHR(
            {
                method: 'POST',
                data,
                // onUploadProgress: e => {
                //     // logger.log('Upload', e.loaded);
                //     if (e.total) {
                //         console.log('Progress',e.loaded);                        
                //     } else {
                //         console.log('Progress done');
                //     }
                // },
                // cancelToken: new Axios.CancelToken(cancel => {
                //     console.log('Cancel');
                // }),
            });
        
            // if (response.success) {
            //     return response.data;
            // } else {
            //     console.warn('[FileService::uploadFiles] Response failed', response);
            //     return [];
            // }
    } catch (e) {       
        console.error('[FileService::uploadFiles] Error', e);
    }
}