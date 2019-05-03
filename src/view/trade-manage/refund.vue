<template>
  <div>
    <div class="conditional-query">
      <Form :label-width="80" v-model="conditionalQueryParam">
        <Row :gutter="16">
          <Col span="6">
            <FormItem label="子商户">
              <Cascader :data="subAppList"
                        v-model="subAppId"
                        change-on-select
                        filterable>
              </Cascader>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="退款单号">
              <Input :clearable="true" v-model="conditionalQueryParam.refundNo" class="form-input"/>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="支付单号">
              <Input :clearable="true" v-model="conditionalQueryParam.chargeNo" class="form-input"/>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="商户订单号">
              <Input :clearable="true" v-model="conditionalQueryParam.orderNo" class="form-input"/>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="16" type="flex" justify="start">
          <Col span="6">
            <FormItem label="退款渠道">
              <Select v-model="conditionalQueryParam.channel" class="form-input" clearable>
                <Option v-for="(value,key) in CHANNEL_ENUM" :value="key" :key="key">{{ value }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="退款时间">
              <DatePicker
                class="form-input"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss"
                @on-change="tradeTimeQueryParamChange"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="退款状态">
              <Select v-model="conditionalQueryParam.status" clearable class="form-input">
                <Option
                  v-for="(value,key) in REFUND_STATUS_ENUM"
                  :value="key"
                  :key="key"
                >{{ value }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="end">
          <Col span="6" push="2">
            <Button @click="getRefundList" type="info" style="width: 50%">筛选</Button>
          </Col>
        </Row>
      </Form>
    </div>
    <div class="content" style="margin-top: 6px">
      <!-- 数据表格 -->
      <Table
        stripe
        border
        :columns="tableColumn"
        :data="refundList"
      ></Table>
      <div class="content-page" style="margin-top: 10px">
        <Row type="flex" justify="end">
          <!-- 分页 -->
          <Page
            :total="pageInfo.total"
            :current="pageInfo.startPage"
            :page-size="pageInfo.pageSize"
            @on-change="startPageChange"
            @on-page-size-change="pageSizeChange"
            show-sizer
            show-total
          />
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import {
  transformRefundStatus,
  transformChannel,
  CHANNEL_ENUM,
  REFUND_STATUS_ENUM
} from "@/libs/StatusTransform";
import { getRefundListRequest, getAppTreeRequest } from "@/api/pay-api";
import { mapGetters } from 'vuex'

export default {
  name: "RefundManage",
  data() {
    return {
      CHANNEL_ENUM,
      REFUND_STATUS_ENUM,
      pageInfo: {
        total: 35,
        startPage: 1,
        pageSize: 10
      },
      conditionalQueryParam: {
        appId: 0,
        status: "",
        channel: "",
        refundNo: "",
        orderNo: "",
        chargeNo: "",
        startDate: "",
        endDate: ""
      },
      tableColumn: [
        {
          title: "退款单号",
          key: "refundNo"
        },
        {
          title: "支付单号",
          key: "chargeNo"
        },
        {
          title: "商户订单号",
          key: "orderNo"
        },
        {
          title: "商品标题",
          key: "subject"
        },
        {
          title: "金额",
          key: "amount"
        },
        {
          title: "退款状态",
          key: "status"
        },
        {
          title: "退款渠道",
          key: "channel"
        },
        {
          title: "创建时间",
          key: "timeCreated"
        },
        {
          title: "成功时间",
          key: "timeSucceed"
        }
      ],
      refundList: [],
      subAppList: [],
      subAppId: []
    };
  },
  methods: {
    translate() {
      // 将英文表示翻译成中文
      this.refundList.forEach(item => {
        item.status = transformRefundStatus(item.status);
        item.channel = transformChannel(item.channel);
        item.amount = parseFloat(item.amount / 100).toFixed(2);
        if(item.timeSucceed === undefined){
            item.timeSucceed = 'N/A';
        }
      });
    },
    pageSizeChange(newPageSize) {
      // 一页显示的数据大小改变
      this.pageInfo.pageSize = newPageSize;
      this.getRefundList();
    },
    startPageChange(newStartPage) {
      // 页码改变
      this.pageInfo.startPage = newStartPage;
      this.getRefundList();
    },
    getRefundList() {
      // 请求获取支付单数据
      let param = {};
      // appId必填
      this.conditionalQueryParam.appId = this.selectedAppId;

      // 指定子商户
      if (this.subAppId.length > 0) {
        this.conditionalQueryParam.subAppId = this.subAppId[this.subAppId.length -1];
      }

      param.startPage = this.pageInfo.startPage;
      param.pageSize = this.pageInfo.pageSize;

      // 查找条件筛选过滤
      for (let i in this.conditionalQueryParam) {
        if (
          this.conditionalQueryParam[i] != "" &&
          this.conditionalQueryParam[i] != undefined
        ) {
          param[i] = this.conditionalQueryParam[i];
        }
      }
      // API 请求
      getRefundListRequest(param)
        .then(res => {
          this.refundList = res.data.list;
          this.pageInfo.total = res.data.total;
          this.translate();
        })
        .catch(err => {
          // TODO 异常需要Notify警示
          console.log(err);
        });
    },
    tradeTimeQueryParamChange(newDate) {
      // newDate为数组格式，第一个为startDate, 第二个为endDate
      this.conditionalQueryParam.startDate = newDate[0];
      this.conditionalQueryParam.endDate = newDate[1];
    },
    buildAppTreeData (data) {
      data.forEach(item => {
        item.value = item.appId
        item.label = item.name
      })
      // 转换后台数据为组件可识别数据
      for (let i = 0; i < data.length; i++) {
        data[i].children = []
        for (let j = 0; j < data.length; j++) {
          if (data[i].appId === data[j].parentAppId) {
            data[i].children.push(data[j])
          }
        }
      }
      const root = data.find(item => item.type === 'MASTER')
      this.subAppList = [root]
    },
    getSubAppList(){
      getAppTreeRequest(this.selectedAppId).then(res => {
        this.buildAppTreeData(res.data)
      })
    }
  },
  computed: {
    ...mapGetters({
      selectedAppId: 'getSelectedAppId'
    })
  },
  mounted() {
    // 每次挂载组件时都进行数据请求
    // TODO 首次获取一周的数据，避免后台数据量过大
    this.getRefundList();
    this.getSubAppList();
  }
};
</script>

<style lang="stylus" scoped>
.form-input
  width 70%
.drawer-footer
  width 400px
  position fixed
  bottom 0
  right 0
  border-top 1px solid #e8e8e8
  padding 10px 16px
  text-align right
  background #fff
</style>

