<template>
  <div class="container">
    <Row type="flex" justify="center">
      <Col span="4"></Col>
      <Col span="10">
        <p class="description">推送延签公钥，对接系统拿此公钥对事件推送请求进行验证</p>
      </Col>
    </Row>
    <Row type="flex" justify="center">
      <Col span="4" class="title">
        <b>通知公钥：</b>
      </Col>
      <Col span="10">
        <Input v-model="appInfo.notifyPublicKey" disabled type="textarea" :rows="6" placeholder/>
      </Col>
    </Row>
    <Row type="flex" justify="center" style="margin-top: 30px">
      <Col span="4"></Col>
      <Col span="10">
        <p class="description">此公钥是平台用来验证对接系统所发送的请求，不配置平台不接受请求</p>
      </Col>
    </Row>
    <Row type="flex" justify="center">
      <Col span="4" class="title">
        <b>交易公钥：</b>
      </Col>
      <Col span="10">
        <Input
          v-model="appInfo.tradePublicKey"
          v-if="!editTradePublicKeyTrigger"
          disabled
          type="textarea"
          :rows="6"
          placeholder
        />
        <Input
          v-model="tradePublicKey"
          v-if="editTradePublicKeyTrigger"
          type="textarea"
          :rows="6"
          placeholder
        />
      </Col>
    </Row>
    <Row type="flex" justify="center">
      <Col span="12" class="alter-btn-container">
        <Button
          type="primary"
          @click="editTradePublicKeyTrigger = true"
          v-if="!editTradePublicKeyTrigger"
        >修改</Button>
        <Button type="primary" @click="updateAppInfo" v-if="editTradePublicKeyTrigger">确定</Button>
      </Col>
    </Row>
  </div>
</template>

<script>
import { getAppInfoRequest, updateAppInfoRequest } from "@/api/pay-api";
export default {
  props:{
    appId:{
      required: true
    },
    hideConfirmBtn: false
  },
  data() {
    return {
      // appId: 0,
      appInfo: {},
      tradePublicKey: "",
      editTradePublicKeyTrigger: false
    };
  },
  methods: {
    updateAppInfo() {
      if (this.tradePublicKey === this.appInfo.tradePublicKey) {
        this.editTradePublicKeyTrigger = false;
        return;
      }
      if (this.tradePublicKey !== null && this.tradePublicKey.length > 10) {
        let param = {};
        param.tradePublicKey = this.tradePublicKey.trim();
        updateAppInfoRequest(this.appId, param).then(res => {
          if (res.data) {
            this.appInfo.tradePublicKey = param.tradePublicKey;
            this.tradePublicKey = param.tradePublicKey;
            this.$Notice.success({
              title: "修改交易公钥成功"
            });
          } else {
            this.$Notice.error({
              title: "修改交易公钥失败"
            });
          }
          this.editTradePublicKeyTrigger = false;
        });
      } else {
        this.$Notice.warning({
          title: "交易公钥不合法"
        });
      }
    }
  },
  mounted() {
    getAppInfoRequest(this.appId).then(res => {
      this.appInfo = res.data;
      this.tradePublicKey = res.data.tradePublicKey;
    });
  }
};
</script>

<style lang="stylus" scoped>
.container
  margin-top 60px
  .description
    font-size 14px
    margin-bottom 6px
  .title
    font-size 14px
    text-align right
  .alter-btn-container
    margin-top 20px
    text-align right
</style>


