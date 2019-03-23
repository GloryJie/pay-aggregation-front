<template>
  <div>
    <Tabs v-model="activeTab">
      <TabPane label="通知日志" icon="ios-notifications" name="NotifyLog">
        <Table :columns="notifyLogColumn" :data="notifyLogList"></Table>

        <div class="content-page" style="margin-top: 10px;">
          <Row type="flex" justify="end">
            <!-- 分页 -->
            <Page
              :total="notifyLogQueryParam.total"
              :current="notifyLogQueryParam.startPage"
              :page-size="notifyLogQueryParam.pageSize"
              @on-change="logStartPageChange"
              @on-page-size-change="logPageSizeChange"
              show-sizer
              show-total
              style="height:180px"
            />
          </Row>
        </div>
      </TabPane>

      <TabPane label="请求日志" name="ApiLog">
        <!-- <Alert type="warning" show-icon>正在规划中，敬请期待</Alert> -->

        <Table :columns="apiLogColumn" :data="apiLogList"></Table>
        <div class="content-page" style="margin-top: 10px;">
          <Row type="flex" justify="end">
            <!-- 分页 -->
            <Page
              :total="apiLogQueryParam.total"
              :current="apiLogQueryParam.startPage"
              :page-size="apiLogQueryParam.pageSize"
              @on-change="logStartPageChange"
              @on-page-size-change="logPageSizeChange"
              show-sizer
              show-total
              style="height:180px"
            />
          </Row>
        </div>
        <div class="content-page" style="margin-top: 10px;"></div>
      </TabPane>

      <TabPane label="支付平台通知日志" name="PlatformNotifyLog">
        <!-- <Alert type="warning" show-icon>正在规划中，敬请期待</Alert> -->

        <Table :columns="platformNotifyLogColumn" :data="platformLogList"></Table>
        <div class="content-page" style="margin-top: 10px;">
          <Row type="flex" justify="end">
            <!-- 分页 -->
            <Page
              :total="platformNofifyLogQueryParam.total"
              :current="platformNofifyLogQueryParam.startPage"
              :page-size="platformNofifyLogQueryParam.pageSize"
              @on-change="logStartPageChange"
              @on-page-size-change="logPageSizeChange"
              show-sizer
              show-total
              style="height:180px"
            />
          </Row>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import {
  getNotifyLogRecordRequest,
  getApiLogRequest,
  getPlatformNotifyLogRequest
} from "@/api/pay-api";
import {
  EVENT_TYPE_ENUM,
  EVENT_NOTIFY_STATUS_ENUM
} from "@/libs/StatusTransform";
import { getDate } from "@/libs/tools";
export default {
  data() {
    return {
      activeTab: "NotifyLog",
      notifyLogQueryParam: {
        startPage: 1,
        pageSize: 10,
        startDate: "",
        endDate: "",
        total: 0
      },
      platformNofifyLogQueryParam: {
        startPage: 1,
        pageSize: 10,
        startDate: "",
        endDate: "",
        total: 0
      },
      apiLogQueryParam: {
        startPage: 1,
        pageSize: 10,
        startDate: "",
        endDate: "",
        total: 0
      },
      notifyLogList: [],
      apiLogList: [],
      platformLogList: [],
      notifyLogColumn: [
        {
          title: "事件ID",
          key: "eventNo"
        },
        {
          title: "事件源",
          key: "sourceNo"
        },
        {
          title: "类型",
          key: "type"
        },
        {
          title: "产生时间",
          key: "timeOccur"
        },
        {
          title: "状态",
          key: "notifyStatus"
        },
        {
          title: "通知次数",
          key: "notifyTime"
        },
        {
          title: "上次通知时间",
          key: "timeLastNotify"
        }
      ],
      apiLogColumn: [
        {
          title: "请求时间",
          key: "reqTimestamp"
        },
        {
          title: "请求方法",
          key: "reqMethod"
        },
        {
          title: "请求地址",
          key: "reqUri"
        },
        {
          title: "请求IP",
          key: "reqClientIp"
        },
        {
          title: "响应状态",
          key: "respHttpStatus"
        },
        {
          title: "响应耗时",
          key: "respMilli"
        }
      ],
      platformNotifyLogColumn: [
        {
          title: "通知时间",
          key: "reqTimestamp"
        },
        {
          title: "通知方法",
          key: "reqMethod"
        },
        {
          title: "通知IP",
          key: "reqClientIp"
        },
        {
          title: "通知平台",
          key: "platform"
        },
        {
          title: "响应状态",
          key: "respHttpStatus"
        },
        {
          title: "响应耗时",
          key: "respMilli"
        }
      ]
    };
  },
  methods: {
    translate() {
      this.notifyLogList.forEach(item => {
        item.notifyStatus = EVENT_NOTIFY_STATUS_ENUM[item.notifyStatus];
        item.type = EVENT_TYPE_ENUM[item.type];
      });
    },
    getNotifyLogRecord() {
      let appId = this.$store.state.pay.selectedAppId;
      let param = Object.assign({}, this.notifyLogQueryParam);
      delete param.total;

      getNotifyLogRecordRequest(appId, param)
        .then(res => {
          this.notifyLogList = res.data.list;
          this.notifyLogQueryParam.total = res.data.total;
          this.translate();
        })
        .catch(res => {});
    },
    getApiLogRecord() {
      let appId = this.$store.state.pay.selectedAppId;
      let param = Object.assign({}, this.apiLogQueryParam);
      delete param.total;

      getApiLogRequest(appId, param)
        .then(res => {
          this.apiLogList = res.data.list;
          this.apiLogQueryParam.total = res.data.total;
          this.apiLogList.forEach(item => {
            item.respMilli = item.respMilli + "ms";
            item.reqTimestamp = getDate(item.reqTimestamp / 1000, "year");
          });
        })
        .catch(res => {});
    },
    getPlatformNotifyLogRecord() {
      let appId = this.$store.state.pay.selectedAppId;
      let param = Object.assign({}, this.platformNofifyLogQueryParam);
      delete param.total;

      getPlatformNotifyLogRequest(appId, param)
        .then(res => {
          this.platformLogList = res.data.list;
          this.platformNofifyLogQueryParam.total = res.data.total;
          this.platformLogList.forEach(item => {
            item.respMilli = item.respMilli + "ms";
            item.reqTimestamp = getDate(item.reqTimestamp / 1000, "year");
          });
        })
        .catch(res => {});
    },
    logStartPageChange(newStartPage) {
      if (this.activeTab === "NotifyLog") {
        this.notifyLogQueryParam.startPage = newStartPage;
        this.getNotifyLogRecord();
      } else if (this.activeTab === "ApiLog") {
        this.apiLogQueryParam.startPage = newStartPage;
        this.getApiLogRecord();
      } else {
        this.platformNofifyLogQueryParam.startPage = newStartPage;
        this.getPlatformNotifyLogRecord();
      }
    },
    logPageSizeChange(newPageSize) {
      if (this.activeTab === "NotifyLog") {
        this.notifyLogQueryParam.pageSize = newPageSize;
        this.getNotifyLogRecord();
      } else if (this.activeTab === "ApiLog") {
        this.apiLogQueryParam.pageSize = newPageSize;
        this.getApiLogRecord();
      } else {
        this.platformNofifyLogQueryParam.pageSize = newPageSize;
        this.getPlatformNotifyLogRecord();
      }
    }
  },
  watch: {
    activeTab(newTab) {
      if (newTab === "ApiLog") {
        this.getApiLogRecord();
      } else if (newTab === "PlatformNotifyLog") {
        this.getPlatformNotifyLogRecord();
      } else {
        this.getNotifyLogRecord();
      }
    }
  },
  mounted() {
    this.getNotifyLogRecord();
  }
};
</script>

<style lang="stylus" scoped>
</style>


