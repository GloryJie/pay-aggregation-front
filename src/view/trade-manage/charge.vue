<template>
  <div>
    <div class="conditional-query">
      <Form :label-width="80" v-model="conditionalQueryParam">
        <Row :gutter="16">
          <Col span="8">
            <FormItem label="支付单号">
              <Input :clearable="true" v-model="conditionalQueryParam.chargeNo" class="form-input"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="商户订单号">
              <Input :clearable="true" v-model="conditionalQueryParam.orderNo" class="form-input"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="支付渠道">
              <Select v-model="conditionalQueryParam.channel" class="form-input" clearable>
                <Option v-for="(value,key) in CHANNEL_ENUM" :value="key" :key="key">{{ value }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="16" type="flex" justify="start">
          <Col span="8">
            <FormItem label="交易时间">
              <DatePicker
                class="form-input"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss"
                @on-change="tradeTimeQueryParamChange"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="支付状态">
              <Select v-model="conditionalQueryParam.status" clearable class="form-input">
                <Option
                  v-for="(value,key) in CHARGE_STATUS_ENUM"
                  :value="key"
                  :key="key"
                >{{ value }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6" style="text-align:center">
            <Button @click="getChargeList" type="info" style="width: 50%">筛选</Button>
          </Col>
        </Row>
      </Form>
    </div>
    <div class="content">
      <Table
        stripe
        border
        :columns="tableColumn"
        :data="chargeList"
        @on-row-click="selectSingleCharge"
      ></Table>
      <div class="content-page" style="margin-top: 10px">
        <Row type="flex" justify="end">
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
    <Drawer
      width="400"
      :style="chargeDrawerStyle"
      v-model="openChargeDrawer"
      title="支付单详情"
      :scrollable="true"
    >
      <div class="drawer-content">
        <CellGroup>
          <Cell title="支付单号" :extra="selectedCharge.chargeNo"/>
          <Cell title="商户订单号" :extra="selectedCharge.orderNo"/>
          <Cell title="应用Id" :extra="String(selectedCharge.appId)"/>
          <Cell title="商品标题" :extra="selectedCharge.subject"/>
          <Cell title="支付单金额" :extra="String(selectedCharge.amount)"/>
          <Cell title="实付金额" :extra="selectedCharge.actualAmount || '*'"/>
          <Cell title="状态" :extra="selectedCharge.status"/>
          <Cell title="支付渠道" :extra="selectedCharge.channel"/>
          <Cell title="渠道交易号" :extra="selectedCharge.platformTradeNo || '*'"/>
          <Cell title="客户端IP" :extra="selectedCharge.clientIp"/>
          <Cell title="过期时间" :extra="String(selectedCharge.timeExpire)"/>
          <Cell title="币种" :extra="selectedCharge.currency"/>
          <Cell title="描述" :extra="selectedCharge.body"/>
          <Cell title="创建时间" :extra="selectedCharge.timeCreated"/>
          <Cell title="支付完成时间" :extra="selectedCharge.timePaid || '*'"/>

          <Card :bordered="false" :dis-hover="true" :padding="0" v-if="selectedCharge.refundList">
            <p slot="title">退款单</p>
            <Collapse v-for="item in selectedCharge.refundList" :key="item.reufndNo">
              <Panel name="1">
                退款单号：{{item.refundNo}}
                <div slot="content">
                  <Cell title="退款金额" :extra="String(item.amount)"/>
                  <Cell title="退款渠道" :extra="item.channel"/>
                  <Cell title="退款状态" :extra="item.status"/>
                </div>
              </Panel>
            </Collapse>
          </Card>
        </CellGroup>
      </div>
      <div class="drawer-footer">
        <Button type="primary" @click="openChargeDrawer = false">关闭</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import {
  transformChargeStatus,
  transformChannel,
  transformRefundStatus,
  CHANNEL_ENUM,
  CHARGE_STATUS_ENUM
} from "@/libs/StatusTransform";
import { getChargeListRequest } from "@/api/pay-api";
export default {
  name: "ChargeManage",
  data() {
    return {
      CHANNEL_ENUM,
      CHARGE_STATUS_ENUM,
      chargeDrawerStyle: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      pageInfo: {
        total: 35,
        startPage: 1,
        pageSize: 10
      },
      conditionalQueryParam: {
        appId: 0,
        status: "",
        channel: "",
        orderNo: "",
        chargeNo: "",
        startDate: "",
        endDate: ""
      },
      openChargeDrawer: false,
      selectedCharge: {},
      tableColumn: [
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
          title: "支付渠道",
          key: "channel"
        },
        {
          title: "支付状态",
          key: "status"
        },
        {
          title: "创建时间",
          key: "timeCreated"
        }
      ],
      chargeList: [
        {
          chargeNo: "543505749247000576",
          orderNo: "1549623468",
          appId: 123456,
          serviceAppId: 123456,
          amount: 1,
          status: "WAIT_PAY",
          subject: "测试1223",
          body: "描述信息",
          channel: "ALIPAY_PAGE",
          clientIp: "127.0.0.1",
          description: "测试",
          timeExpire: 2,
          liveMode: true,
          currency: "cny",
          extra: {
            returnUrl: "http://www.baidu.com"
          },
          timeCreated: "2019-02-08T18:57:48",
          refundList: [
            {
              refundNo: "12379812738912",
              channel: "ALIPAY_PAGE",
              status: "SUCCESS",
              amount: 1
            }
          ]
        }
      ]
    };
  },
  methods: {
    selectSingleCharge(chargeData) {
      // 单击选择某条支付单时
      this.selectedCharge = chargeData;
      this.openChargeDrawer = true;
    },
    translate() {
      // 将英文表示翻译成中文
      this.chargeList.forEach(item => {
        item.status = transformChargeStatus(item.status);
        item.channel = transformChannel(item.channel);
        item.amount = parseFloat(item.amount / 100).toFixed(2);
        if (item.refundList) {
          item.refundList.forEach(refund => {
            refund.channel = transformChannel(refund.channel);
            refund.status = transformRefundStatus(refund.status);
            refund.amount = parseFloat(refund.amount / 100).toFixed(2);
          });
        }
      });
    },
    pageSizeChange(newPageSize) {
      // 一页显示的数据大小改变
      this.pageInfo.pageSize = newPageSize;
      this.getChargeList();
    },
    startPageChange(newStartPage) {
      // 页码改变
      this.pageInfo.startPage = newStartPage;
      this.getChargeList();
    },
    getChargeList() {
      // 请求获取支付单数据
      let param = {};
      let appId = this.$store.state.pay.selectedAppId;
      // appId必填
      this.conditionalQueryParam.appId = appId;

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
      getChargeListRequest(param)
        .then(res => {
          this.chargeList = res.data.list;
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
    }
  },
  mounted() {
    // 每次挂载组件时都进行数据请求
    this.getChargeList();
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

