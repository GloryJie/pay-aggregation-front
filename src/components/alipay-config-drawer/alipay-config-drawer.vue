<template>
  <Drawer title="配置详情" width="450" :closable="true" v-model="showDrawer" :scrollable="true">
    <Form ref="configForm" :model="alipayChannelConfig" :rules="rules" :label-width="100">
      <FormItem label="商户号：" prop="merchantId">
        <Input v-model="alipayChannelConfig.merchantId"/>
      </FormItem>

      <FormItem label="加密类型：" prop="type">
        <RadioGroup v-model="alipayChannelConfig.type">
          <Radio label="RSA1"></Radio>
          <Radio label="RSA2"></Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="状态：" prop="status">
        <RadioGroup v-model="alipayChannelConfig.status">
          <Radio label="START_USING">启用</Radio>
          <Radio label="STOP_USING">暂停</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="支付宝私钥：" prop="merchantPrivateKey">
        <Input v-model="alipayChannelConfig.merchantPrivateKey" type="textarea" :rows="15"/>
      </FormItem>

      <FormItem label="支付宝公钥：" prop="merchantPublicKey">
        <Input v-model="alipayChannelConfig.merchantPublicKey" type="textarea" :rows="10"/>
      </FormItem>
    </Form>

    <div class="demo-drawer-footer" prop="name">
      <Button style="margin-right: 10px" @click="showDrawer = false">取消</Button>
      <Button type="primary" @click="confirm">确定</Button>
    </div>
  </Drawer>
</template>


<script>
export default {
  props: {
    channel: {
      type: Object,
      required: true
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      alipayChannelConfig: {
        merchantPrivateKey: "",
        merchantId: "",
        merchantPublicKey: "",
        type: "RSA2",
        status: "START_USING"
      },
      showDrawer: this.value,
      rules: {
        merchantId: [
          { required: true, message: "支付宝商户号不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "支付宝密钥类型不能为空", trigger: "blur" }
        ],
        merchantPrivateKey: [
          { required: true, message: "支付宝私钥不能为空", trigger: "blur" }
        ],
        merchantPublicKey: [
          { required: true, message: "支付宝公钥不能为空", trigger: "blur" }
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {
    showDrawer(newVal) {
      if (newVal) {
        // 打开时进行数据初始化
        if (this.channel.isOpened) {
          this.alipayChannelConfig = Object.assign(
            {},
            this.channel.channelConfig
          );
          this.alipayChannelConfig.status = this.channel.status;
        } else {
          this.alipayChannelConfig = {
            merchantPrivateKey: "",
            merchantId: "",
            merchantPublicKey: "",
            type: "RSA2",
            status: "START_USING"
          };
        }
      } else {
        // 关闭时清除校验结果
        this.$refs["configForm"].resetFields();
      }
      this.$emit("input", newVal);
    },
    value(newVal) {
      this.showDrawer = newVal;
    }
  },
  methods: {
    confirm() {
      this.$refs["configForm"].validate(valid => {
        if (valid) {
          this.$emit(
            "confirm",
            this.channel,
            Object.assign({}, this.alipayChannelConfig)
          );
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.demo-drawer-footer
  width 450px
  position fixed
  bottom 0
  right 0
  border-top 1px solid #e8e8e8
  padding 10px 16px
  text-align right
  background #fff
</style>


