let sdkMap = {
    // 键：sdkUrl 值：如下
    // url sdk链接
    // status 当前状态：PENDING, LOADED, LOADED_ERR, TIME_OUT_ERR
    // error LOADED_ERR状态下的Error对象
};
// 加载中的sdk promise
let promiseMap = {
    // sdkUrl: loadingPromise
};
const PENDING = 1;
const LOADED = 2;
const LOADED_ERR = 3;
const TIME_OUT_ERR = 4;

const startLoading = (sdkUrl = '', timeout) => {
    let sdkInfo = {
        url: sdkUrl,
        status: PENDING,
    };
    let block = false;
    return new Promise((resolve) => {
        let clearNum;
        if(timeout) {
            clearNum = setTimeout(() => {
                block = true;
                sdkInfo.status = TIME_OUT_ERR;
                resolve(sdkInfo);
            }, timeout);
        }
        let script = document.createElement('script');
        script.src = sdkUrl;
        script.addEventListener('load', () => {
            if(block) {
                return;
            }
            clearNum && clearTimeout(clearNum);
            sdkInfo.status = LOADED;
            resolve(sdkInfo);
        });
        script.addEventListener('error', (e) => {
            if(block) {
                return;
            }
            clearNum && clearTimeout(clearNum);
            sdkInfo.status = LOADED_ERR;
            sdkInfo.error = e;
            resolve(sdkInfo);
        });
        document.body.parentNode.appendChild(script);
    });
};

/**
 * 单例的加载 js sdk
 * @param {String} sdkUrl
 * @param {Number} options.timeout sdk加载超时时间，超时后直接返回。默认undefined，无超时。
 * @param {Boolean} options.ignoreProtocal 是否忽略sdkUrl的协议头，协议头不同也认为是同一个sdk。默认false。
 * @param {Boolean} options.ignoreQuery 是否忽略sdkUrl的请求参数，参数不同也认为是同一个sdk。默认false。
 */
const loadSDK = (sdkUrl = '', options = {}) => new Promise((resolve) => {
    const {
        timeout,
        ignoreProtocal = false,
        ignoreQuery = false
    } = options;
    if(ignoreProtocal) {
        sdkUrl = sdkUrl.replace(/^(https?:)?\/\//, '');
    }
    if(ignoreQuery) {
        sdkUrl = sdkUrl.replace(/\?[^?]*$/, '');
    }
    const promise = promiseMap[sdkUrl];
    let sdkInfo = sdkMap[sdkUrl];
    // sdk未加载
    if(!sdkInfo && !promise) {
        let loadingPromise = startLoading(sdkUrl, timeout);
        promiseMap[sdkUrl] = loadingPromise;
        loadingPromise.then((res) => {
            sdkInfo = sdkMap[sdkUrl] = res;
            delete promiseMap[sdkUrl];
            resolve(sdkInfo);
        });
        return;
    }
    // sdk加载中
    if(promise && !sdkInfo) {
        promise.then((res) => {
            resolve(res);
        });
        return;
    }
    // sdk已加载完成
    resolve(sdkInfo);
});

export {
    loadSDK,
    PENDING,
    LOADED,
    LOADED_ERR,
    TIME_OUT_ERR
}

export default {
    loadSDK,
    PENDING,
    LOADED,
    LOADED_ERR,
    TIME_OUT_ERR
};