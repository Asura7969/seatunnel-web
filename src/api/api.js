import req from './index.js'                //连接接口文件
export const submitJobs = function(body){
    //post方法以及传参    qwe是字段   e是参数
    return req('post','/hazelcast/rest/maps/submit-job', body)
    // body: { qwe: e }
}

export const stopJobs = function(e){
    //post方法以及传参
    return req('post','/hazelcast/rest/maps/stop-job', { jobId: e, isStopWithSavePoint: false })    
}


export const runningJobs = function(){
    return req('get','/hazelcast/rest/maps/running-jobs')  
}

export const jobDetail = function(e){
    return req('get','/hazelcast/rest/maps/running-job/' + e)  
}


export const sysInfo = function(e){
    return req('get','/hazelcast/rest/maps/system-monitoring-information')  
}

// import { request1, request2 } from '../api/api' \
// 
// request1(123)     //函数名以及传参
// .then(res => {
//     console.log(res)    //成功后返回的数据
// })