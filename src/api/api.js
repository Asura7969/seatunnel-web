import req from "./index.js"; //连接接口文件
export const submitJobs = function (body) {
  //post方法以及传参    qwe是字段   e是参数
  return req("post", "/hazelcast/rest/maps/submit-job", body);
  // body: { qwe: e }
};

export const stopJobs = function (e) {
  //post方法以及传参
  return req("post", "/hazelcast/rest/maps/stop-job", {
    jobId: e,
    isStopWithSavePoint: false,
  });
};

export const runningJobs = function () {
  return req("get", "/hazelcast/rest/maps/running-jobs");
};

export const jobDetail = function (e) {
  return req("get", "/hazelcast/rest/maps/running-job/" + e);
};

export const sysInfo = function (e) {
  return req("get", "/hazelcast/rest/maps/system-monitoring-information");
};

export const getDatasource = function () {
  return req("get", "/datasource/queryAll");
};

export const getTaskList = function () {
  return req("get", "/task/queryAll");
};

// 获取任务json详情
export const getTaskJsonById = function (id) {
  return req("get", "/task/queryJsonById/" + id);
};

// 查询任务表单详情
export const getTaskDetailById = function (id) {
  return req("get", "/task/detail/" + id);
};

// 创建任务
export const upsertTask = function (data) {
  return req("post", "/task/upsert", data);
};

// 部署任务
export const deployTask = function (id) {
  return req("post", "/task/deploy/" + id);
};

// 停止任务
export const stopTask = function (id) {
  return req("post", "/task/stop/" + id);
};
