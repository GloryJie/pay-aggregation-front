<template>
  <div>
    <Tabs>
      <TabPane label="已开通" icon="logo-apple">
        <Table
          :columns="tableColumn"
          :data="alreadyOpenedChannelList"
          @on-row-click="selectChannel"
        ></Table>
      </TabPane>

      <TabPane label="支付宝" icon="logo-apple">
        <Row type="flex" justify="center" style="margin-top: 30px">
          <Col span="4" v-for="item in alipayChannelList" :key="item.channel">
            <channel-card v-bind="item" @click.native="selectChannel(item)"/>
          </Col>
        </Row>
      </TabPane>

      <TabPane label="微信" icon="logo-windows">
        <Row type="flex" justify="center" style="margin-top: 30px">
          <Col span="4" v-for="item in wxpayChannelList" :key="item.channel">
            <channel-card v-bind="item" @click.native="selectChannel(item)"/>
          </Col>
        </Row>
      </TabPane>

      <TabPane label="银联" icon="logo-tux">
        <Row type="flex" justify="center" style="margin-top: 30px">
          <Col span="4" v-for="item in unionpayChannelList" :key="item.channel">
            <channel-card v-bind="item" @click.native="selectChannel(item)"/>
          </Col>
        </Row>
      </TabPane>
    </Tabs>

    <alipay-config-drawer
      v-model="showAlipayChannelConfigDrawer"
      :channel="selectedAlipayChannel"
      @confirm="handleConfigConfirm"
    />
  </div>
</template>

<script>
import AlipayConfigDrawer from "@/components/alipay-config-drawer";
import ChannelCard from "@/components/channel-card";
import { CHANNEL_ENUM } from "@/libs/StatusTransform";
import {
  getOpenedChannelConfigRequest,
  addNewChannelConfigRequest,
  updateChannelConfigRequest,
  deleteChannelConfigRequest
} from "@/api/pay-api";

export default {
  name: "ChannelConfig",
  components: {
    CHANNEL_ENUM,
    ChannelCard,
    AlipayConfigDrawer
  },
  data() {
    return {
      tableColumn: [
        {
          title: "支付平台",
          key: "platform"
        },
        {
          title: "支付产品",
          key: "product"
        },
        {
          title: "开通时间",
          key: "startDate"
        },
        {
          title: "上次停用时间",
          key: "stopDate"
        },
        {
          title: "状态",
          key: "statusCN"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: e => {
                      this.removeChannelConfig(params.row);
                      e.stopPropagation();
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      channelList: [
        {
          platform: "支付宝",
          product: "电脑网站支付",
          channel: "ALIPAY_PAGE",
          icon: "ALIPAY_PAGE.png",
          desc: "用户在商家PC网站上完成支付",
          channelConfig: {},
          status: "",
          isOpened: false,
          startDate: "",
          stopDate: "",
          isAvailable: true
        },
        {
          platform: "支付宝",
          product: "手机网站支付",
          channel: "ALIPAY_WAP",
          icon: "ALIPAY_WAP.png",
          desc: "用户在商家手机网站上完成支付",
          channelConfig: {},
          status: "",
          isOpened: false,
          startDate: "",
          stopDate: "",
          isAvailable: true
        },
        {
          platform: "支付宝",
          product: "APP支付",
          channel: "ALIPAY_APP",
          icon: "ALIPAY_APP.png",
          desc: "用户在商家APP上完成支付",
          channelConfig: {},
          status: "",
          isOpened: false,
          startDate: "",
          stopDate: "",
          isAvailable: true
        },
        {
          platform: "支付宝",
          product: "当面付：扫码支付",
          channel: "ALIPAY_SCAN_CODE",
          icon: "ALIPAY_SCAN_CODE.png",
          desc: "用户扫描商家的二维码完成付款",
          channelConfig: {},
          status: "",
          isOpened: false,
          startDate: "",
          stopDate: "",
          isAvailable: true
        },
        {
          platform: "支付宝",
          product: "当面付：条码支付",
          channel: "ALIPAY_BAR_CODE",
          icon: "ALIPAY_BAR_CODE.png",
          desc: "只需扫描用户的付款码",
          channelConfig: {},
          status: "",
          isOpened: false,
          startDate: "",
          stopDate: "",
          isAvailable: false
        },
        {
          platform: "微信",
          product: "付款码支付",
          channel: "WXPAY_CODE",
          icon: "WXPAY_CODE.png",
          desc: "用户打开微信钱包-付款码的界面，商户扫码后提交完成支付",
          channelConfig: {},
          status: "",
          isOpened: false,
          startDate: "",
          stopDate: "",
          isAvailable: false
        },
        {
          platform: "微信",
          product: "JSAPI支付",
          channel: "WXPAY_JSAPI",
          icon: "WXPAY_JSAPI.png",
          desc:
            "用户通过微信扫码、关注公众号等方式进入商家H5页面，并在微信内调用JSSDK完成支付",
          channelConfig: {},
          status: "",
          isOpened: false,
          startDate: "",
          stopDate: "",
          isAvailable: false
        },
        {
          platform: "微信",
          product: "Native支付",
          channel: "WXPAY_NATIVE",
          icon: "WXPAY_NATIVE.png",
          desc: "用户打开‘微信扫一扫’，扫描商户的二维码后完成支付",
          channelConfig: {},
          status: "",
          isOpened: false,
          startDate: "",
          stopDate: "",
          isAvailable: false
        },
        {
          platform: "微信",
          product: "H5支付",
          channel: "WXPAY_H5",
          icon: "WXPAY_H5.png",
          desc: "用户在微信以外的手机浏览器请求微信支付的场景唤起微信支付",
          channelConfig: {},
          status: "",
          isOpened: false,
          startDate: "",
          stopDate: "",
          isAvailable: false
        },
        {
          platform: "微信",
          product: "小程序支付",
          channel: "WXPAY_SMALL_APP",
          icon: "WXPAY_SMALL_APP.png",
          desc: "用户在微信小程序中使用微信支付的场景",
          channelConfig: {},
          status: "",
          isOpened: false,
          startDate: "",
          stopDate: ""
        },
        {
          platform: "银联",
          product: "PC网站支付",
          channel: "UNIONPAY_PAGE",
          icon: "ALIPAY_APP.png",
          desc: "用户电脑网站使用银联支付的场景",
          channelConfig: {},
          status: "",
          isOpened: false,
          startDate: "",
          stopDate: "",
          isAvailable: false
        },
        {
          platform: "银联",
          product: "手机网站支付(WAP支付)",
          channel: "UNIONPAY_WAP",
          icon: "ALIPAY_APP.png",
          desc: "用户手机网站使用银联支付的场景",
          channelConfig: {},
          status: "",
          isOpened: false,
          startDate: "",
          stopDate: "",
          isAvailable: false
        },
        {
          platform: "银联",
          product: "二维码支付",
          channel: "UNIONPAY_QRCODE",
          icon: "ALIPAY_APP.png",
          desc:
            "主扫模式指收款人展示二维码，付款人扫描二维码；被扫模式指付款人展示二维码，收款人扫描二维码。",
          channelConfig: {},
          status: "",
          isOpened: false,
          startDate: "",
          stopDate: "",
          isAvailable: false
        }
      ],
      showAlipayChannelConfigDrawer: false,
      showDeleteModal: false,
      deleteChannel: "",
      alipayChannelConfig: {
        channel: "",
        merchantPrivateKey: "",
        merchantId: "",
        merchantPublicKey: "",
        type: "RSA2"
      },
      selectedAlipayChannel: {}
    };
  },
  computed: {
    alreadyOpenedChannelList() {
      return this.channelList.filter(item => {
        return item.isOpened;
      });
    },
    alipayChannelList() {
      return this.channelList.filter(item => {
        return item.platform === "支付宝";
      });
    },
    unionpayChannelList() {
      return this.channelList.filter(item => {
        return item.platform === "银联";
      });
    },
    wxpayChannelList() {
      return this.channelList.filter(item => {
        return item.platform === "微信";
      });
    }
  },
  methods: {
    alterChannelListByOpenedObject(openedChannelObject) {
      // find返回的是索引，修改有效
      let channelObject = this.channelList.find(item => {
        return item.channel === openedChannelObject.channel;
      });
      if (channelObject === undefined) {
        return;
      }
      let {
        channel,
        status,
        channelConfig,
        startDate,
        stopDate
      } = openedChannelObject;
      channelObject.channelConfig = channelConfig;
      channelObject.status = status;
      channelObject.statusCN = status === "START_USING" ? "已启用" : "暂停";
      channelObject.startDate = startDate;
      channelObject.stopDate = stopDate;
      channelObject.isOpened = true;
    },
    getOpenedChannelConfig() {
      let appId = this.$store.state.pay.selectedAppId;
      getOpenedChannelConfigRequest(appId)
        .then(res => {
          for (let key in res.data) {
            this.alterChannelListByOpenedObject(res.data[key]);
          }
        })
        .catch(err => {});
    },
    selectChannel(channel) {
      if (!channel.isAvailable) {
        this.$Notice.info({
          title: "当前支付渠道尚未接通，敬请期待"
        });
        return;
      }
      if (channel.platform === "支付宝") {
        this.selectedAlipayChannel = channel;
        this.showAlipayChannelConfigDrawer = true;
        return;
      }
    },
    handleConfigConfirm(channel, config) {
      let param = {};
      param.status = config.status;
      param.channel = channel.channel;
      let configParam = Object.assign({}, config);
      delete configParam.status;
      param.channelConfig = configParam;
      let appId = this.$store.state.pay.selectedAppId;

      if (channel.isOpened) {
        // 更新操作
        updateChannelConfigRequest(appId, param)
          .then(res => {
            this.closeAllDrawer();
            this.alterChannelListByOpenedObject(res.data);
            this.$Notice.success({
              title: "渠道配置更新成功"
            });
          })
          .catch(res => {});
      } else {
        // 添加操作
        addNewChannelConfigRequest(appId, param)
          .then(res => {
            this.closeAllDrawer();
            this.alterChannelListByOpenedObject(res.data);
            this.$Notice.success({
              title: "配置新成功"
            });
          })
          .catch(res => {});
      }
    },
    removeChannelConfig(channel) {
      let appId = this.$store.state.pay.selectedAppId;
      var self = this;
      this.$Modal.confirm({
        title: "确认删除该渠道配置吗",
        content:
          "删除后将会影响未到达的支付平台异步通知结果，需要对接应用主动查询",
        onOk() {
          deleteChannelConfigRequest(appId, channel.channel)
            .then(res => {
              let channelObject = self.channelList.find(
                item => item.channel === channel.channel
              );
              channelObject.status = "";
              channelObject.channelConfig = {};
              channelObject.startDate = "";
              channelObject.stopDate = "";
              channelObject.isOpened = false;
              channelObject.self.$Notice.success({
                title: "删除配置成功"
              });
            })
            .catch(res => {});
        }
      });
    },
    closeAllDrawer() {
      this.showAlipayChannelConfigDrawer = false;
    }
  },
  mounted() {
    this.getOpenedChannelConfig();
  }
};
</script>

<style lang="stylus" scoped>
</style>


