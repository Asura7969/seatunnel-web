import Mock from "mockjs";

// 查询任务表单
Mock.mock(/\/task\/detail/, "get", (id) => {
  return {
    code: 200,
    data: {
      jobType: "STREAMING",
      jobName: "回显任务",
      sourceId: 1,
      sourceProp: {
        exactlyOnce: "true",
        tableName: "asdasd",
        serverId: "56756",
      },
      sinkId: 2,
      transformValue: null,
      sinkProp: {
        sinkEnable2pc: "true",
        sinkEnableDelete: "true",
        tableName: "fghfghgh",
        sinkLabelPrefix: "uyiuyhfg",
      },
      jsonValue: null,
    },
  };
});

// 查询数据源
Mock.mock("/datasource/queryAll", "get", () => {
  return {
    code: 200,
    data: [
      {
        id: 2,
        name: "数仓Doris",
        type: "DORIS",
        address: "127.0.0.1:15433",
        database: "test",
      },
      {
        id: 1,
        name: "sim",
        type: "MYSQL",
        address: "127.0.0.1:3306",
        database: "test",
      },
      {
        id: 3,
        name: "mes",
        type: "PG",
        address: "127.0.0.1:8030",
        database: "test",
      },
      {
        id: 4,
        name: "数仓StarRocks",
        type: "STARROCKS",
        address: "127.0.0.1:8031",
        database: "test",
      },
    ],
  };
});

// 查询任务列表
Mock.mock("/task/queryAll", "get", () => {
  return {
    code: 200,
    data: {
      list: [
        {
          id: 1,
          name: "mysql_cdc_to_ds",
          status: "CANCELED",
          createTime: "2024-02-01",
        },
        {
          id: 2,
          name: "pg_cdc_to_ds",
          status: "RUNNING",
          createTime: "2023-02-01",
        },
        {
          id: 3,
          name: "mysql_cdc_to_ds",
          status: "CANCELED",
          createTime: "2024-02-01",
        },
        {
          id: 4,
          name: "mysql_cdc_to_ds",
          status: "RUNNING",
          createTime: "2024-02-01",
        },
      ],
      total: 100,
      page: 1,
      pageSize: 20,
    },
  };
});

// 查询任务详情
Mock.mock(/\/task\/queryJsonById/, "get", (id) => {
  return {
    code: 200,
    data: {
      env: {
        "job.mode": "STREAMING",
        parallelism: 1,
      },
      source: [
        {
          "base-url":
            "jdbc:mysql://dev-mysql.starcharge.cloud:3306/wb_sim?useSSL=true",
          password: "4qC8xGIjD",
          "table-names": ["wb_sim.t_operation_log"],
          "database-names": ["wb_sim"],
          plugin_name: "MySQL-CDC",
          username: "dev",
          port: "3306",
          hostname: "dev-mysql.starcharge.cloud",
          "database-name": "wb_sim",
          result_table_name: "ts1",
          "server-id": "5400",
          exactly_once: true,
        },
      ],
      sink: [
        {
          plugin_name: "Doris",
          fenodes: "172.20.102.33:8030",
          username: "root",
          password: "wbbigdata",
          database: "test",
          table: "ods_t_operation_log",
          "sink.label-prefix": "t_operation_log_cdc",
          "sink.enable-2pc": "true",
          "sink.enable-delete": "true",
          "doris.config": {
            format: "json",
            read_json_by_line: "true",
          },
        },
      ],
    },
  };
});

Mock.mock("/hazelcast/rest/maps/stop-job", "post", () => {
  return {
    code: 200,
    data: {
      jobId: 733584788375666689,
    },
  };
});

Mock.mock("/hazelcast/rest/maps/submit-job", "post", () => {
  return {
    code: 200,
    data: {
      jobId: 733584788375666689,
      jobName: "rest_api_test",
    },
  };
});

Mock.mock("/hazelcast/rest/maps/system-monitoring-information", "get", () => {
  return {
    code: 200,
    data: [
      {
        processors: "8",
        "physical.memory.total": "16.0G",
        "physical.memory.free": "16.3M",
        "swap.space.total": "0",
        "swap.space.free": "0",
        "heap.memory.used": "135.7M",
        "heap.memory.free": "440.8M",
        "heap.memory.total": "576.5M",
        "heap.memory.max": "3.6G",
        "heap.memory.used/total": "23.54%",
        "heap.memory.used/max": "3.73%",
        "minor.gc.count": "6",
        "minor.gc.time": "110ms",
        "major.gc.count": "2",
        "major.gc.time": "73ms",
        "load.process": "24.78%",
        "load.system": "60.00%",
        "load.systemAverage": "2.07",
        "thread.count": "117",
        "thread.peakCount": "118",
        "cluster.timeDiff": "0",
        "event.q.size": "0",
        "executor.q.async.size": "0",
        "executor.q.client.size": "0",
        "executor.q.client.query.size": "0",
        "executor.q.client.blocking.size": "0",
        "executor.q.query.size": "0",
        "executor.q.scheduled.size": "0",
        "executor.q.io.size": "0",
        "executor.q.system.size": "0",
        "executor.q.operations.size": "0",
        "executor.q.priorityOperation.size": "0",
        "operations.completed.count": "10",
        "executor.q.mapLoad.size": "0",
        "executor.q.mapLoadAllKeys.size": "0",
        "executor.q.cluster.size": "0",
        "executor.q.response.size": "0",
        "operations.running.count": "0",
        "operations.pending.invocations.percentage": "0.00%",
        "operations.pending.invocations.count": "0",
        "proxy.count": "8",
        "clientEndpoint.count": "0",
        "connection.active.count": "2",
        "client.connection.count": "0",
        "connection.count": "0",
      },
    ],
  };
});

Mock.mock("/hazelcast/rest/maps/running-job/1", "get", () => {
  return {
    code: 200,
    data: {
      jobId: "1",
      jobName: "mysql-cdc",
      jobStatus: "RUNNING",
      envOptions: {},
      createTime: "",
      jobDag: {
        vertices: [],
        edges: [],
      },
      pluginJarsUrls: [],
      isStartWithSavePoint: false,
      metrics: {
        sourceReceivedCount: "",
        sinkWriteCount: "",
      },
    },
  };
});

Mock.mock("/hazelcast/rest/maps/running-jobs", "get", () => {
  return {
    code: 200,
    data: [
      {
        jobId: "1",
        jobName: "mysql-cdc",
        jobStatus: "RUNNING",
        envOptions: {},
        createTime: "",
        jobDag: {
          vertices: [],
          edges: [],
        },
        pluginJarsUrls: [],
        isStartWithSavePoint: false,
        metrics: {
          sourceReceivedCount: "",
          sinkWriteCount: "",
        },
      },
    ],
  };
});
