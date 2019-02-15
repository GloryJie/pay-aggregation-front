<template>
  <div>
    <Tabs @on-click="changeLogTab">
      <TabPane label="通知日志" icon="ios-notifications" name="NotifyLog">
        <Table :columns="notifyLogColumn" :data="notifyLogList"></Table>

        <div class="content-page" style="margin-top: 10px;">
          <Row type="flex" justify="end">
            <!-- 分页 -->
            <Page
              :total="notifyLogQueryParam.total"
              :current="notifyLogQueryParam.startPage"
              :page-size="notifyLogQueryParam.pageSize"
              @on-change="notifyLogStartPageChange"
              @on-page-size-change="notifyLogPageSizeChange"
              show-sizer
              show-total
              style="height:180px"
            />
          </Row>
        </div>
      </TabPane>

      <TabPane label="请求日志" name="RequestLog">
        <Alert type="warning" show-icon>正在规划中，敬请期待</Alert>
      </TabPane>

      <TabPane label="支付平台通知日志" name="PlatformNotifyLog">
        <Alert type="warning" show-icon>正在规划中，敬请期待</Alert>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { getNotifyLogRecordRequest } from "@/api/pay-api";
import {
  EVENT_TYPE_ENUM,
  EVENT_NOTIFY_STATUS_ENUM
} from "@/libs/StatusTransform";
export default {
  data() {
    return {
      notifyLogQueryParam: {
        startPage: 1,
        pageSize: 10,
        startDate: "",
        endDate: "",
        total: 0
      },
      notifyLogList: [],
      requestLogList: [],
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
      ]
    };
  },
  methods: {
    changeLogTab(name) {
      console.log(name);
    },
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
    notifyLogStartPageChange(newStartPage) {
      this.notifyLogQueryParam.startPage = newStartPage;
      this.getNotifyLogRecord();
    },
    notifyLogPageSizeChange(newPageSize) {
      this.notifyLogQueryParam.pageSize = newPageSize;
      this.getNotifyLogRecord();
    }
  },
  mounted() {
    this.getNotifyLogRecord();
  }
};
</script>

<style lang="stylus" scoped>
</style>


