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
 * @param {*} options timeout: 默认10s，超过10s加载未结束，直接返回并报异常
 */
const loadSDK = async (sdkUrl = '', options = {}) => {
    const { timeout } = options;
    const promise = promiseMap[sdkUrl];
    let sdkInfo = sdkMap[sdkUrl];
    // sdk未加载
    if(!sdkInfo && !promise) {
        let loadingPromise = startLoading(sdkUrl, timeout);
        promiseMap[sdkUrl] = loadingPromise;
        sdkInfo = sdkMap[sdkUrl] = await loadingPromise;
        delete promiseMap[sdkUrl];
        return sdkInfo;
    }
    // sdk加载中
    if(promise && !sdkInfo) {
        return await promise;
    }
    // sdk已加载完成
    return sdkInfo;
};

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