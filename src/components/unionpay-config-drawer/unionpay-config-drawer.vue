<template>
  <Drawer title="配置详情" width="450"
          :closable="true"
          v-model="showDrawer"
          :scrollable="true"
          :closeable="false"
          :mask-closable="false"
  >
    <Form ref="configForm" :model="unionpayChannelConfig" :rules="rules" :label-width="100">

      <FormItem label="商户号：" prop="merchantId">
        <Input v-model="unionpayChannelConfig.merchantId" :disabled="channel.isOpened"/>
      </FormItem>


      <FormItem label="状态：" prop="status">
        <RadioGroup v-model="unionpayChannelConfig.status">
          <Radio label="START_USING">启用</Radio>
          <Radio label="STOP_USING">暂停</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="私钥证书：">
        <Upload accept="application/x-pkcs12"
                :action="signCertUploadUrl"
                :before-upload="handleUploadBefore"
                :on-success="handleUploadSuccess"
                :headers="uploadHeaders"
                ref="signCertRef">
          <Button icon="ios-cloud-upload-outline" :disabled="channel.isOpened">上传</Button>
        </Upload>
      </FormItem>

      <FormItem label="中级证书：">
        <Upload accept="application/x-x509-ca-cert"
                :action="middleCertUploadUrl"
                :before-upload="handleUploadBefore"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                ref="middleCertRef">
          <Button icon="ios-cloud-upload-outline" :disabled="channel.isOpened">上传</Button>
        </Upload>
      </FormItem>

      <FormItem label="根证书：">
        <Upload accept="application/x-x509-ca-cert"
                :action="rootCertUploadUrl"
                :before-upload="handleUploadBefore"
                :on-success="handleUploadSuccess"
                ref="rootCertRef">
          <Button icon="ios-cloud-upload-outline" :disabled="channel.isOpened">上传</Button>
        </Upload>
      </FormItem>

    </Form>

    <div class="demo-drawer-footer" prop="name">
      <Button style="margin-right: 10px" @click="showDrawer = false">取消</Button>
      <Button type="primary" @click="confirm">确定</Button>
    </div>
  </Drawer>
</template>


<script>
  import { mapGetters } from 'vuex'

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
    data () {
      return {
        uploadHeaders: {},
        unionpayChannelConfig: {
          merchantId: '',
          status: 'START_USING'
        },
        showDrawer: this.value,
        rules: {
          merchantId: [{ required: true, message: '商户号不能为空', trigger: 'blur' }],
          status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
        },
        certType: {
          signCert: 'UNIONPAY_SIGN_CERT',
          rootCert: 'UNIONPAY_ROOT_CERT',
          middleCert: 'UNIONPAY_MIDDLE_CERT',
        },
        signCertUploadData: {
          appId: '',
          channel: '',
          certType: 'UNIONPAY_SIGN_CERT'
        },
        uploadHeaders: {}
      }
    },
    watch: {
      showDrawer (newVal) {
        if (newVal) {
          // 打开时进行数据初始化
          if (this.channel.isOpened) {
            this.unionpayChannelConfig = Object.assign(
              {},
              this.channel.channelConfig
            )
            this.unionpayChannelConfig.status = this.channel.status
          } else {
            this.unionpayChannelConfig = {
              merchantPrivateKey: '',
              merchantId: '',
              merchantPublicKey: '',
              type: 'RSA2',
              status: 'START_USING'
            }
          }
        } else {
          // 关闭时清除校验结果, 清楚文件状态
          this.$refs['configForm'].resetFields()
          this.clearUploadFilesStatus()
        }
        this.$emit('input', newVal)
      },
      value (newVal) {
        this.showDrawer = newVal
      }
    },
    computed: {
      ...mapGetters([
        'getSelectedAppId',
        'getAccessToken'
      ]),
      signCertUploadUrl () {
        return `/trade/web/app/${this.getSelectedAppId}/channel/${this.channel.channel}/cert/${this.certType.signCert}`
      },
      middleCertUploadUrl () {
        return `/trade/web/app/${this.getSelectedAppId}/channel/${this.channel.channel}/cert/${this.certType.middleCert}`
      },
      rootCertUploadUrl () {
        return `/trade/web/app/${this.getSelectedAppId}/channel/${this.channel.channel}/cert/${this.certType.rootCert}`
      }
    },
    methods: {
      confirm () {
        console.log(this.uploadHeaders)
        // this.$refs['configForm'].validate(valid => {
        //   if (valid) {
        //     this.$emit(
        //       'confirm',
        //       this.channel,
        //       Object.assign({}, this.unionpayChannelConfig)
        //     )
        //   }
        // })
      },
      handleUploadBefore(){
        this.uploadHeaders.Authorization = 'Bearer' + this.getAccessToken;
      },
      handleUploadSuccess (response) {
        this.$Notice.success({ title: '文件上传成功' })
      },
      handleUploadError (error) {
        this.$Notice.error({ title: '文件上传失败' })
      },
      clearUploadFilesStatus () {
        this.$refs.signCertRef.clearFiles()
        this.$refs.rootCertRef.clearFiles()
        this.$refs.middleCertRef.clearFiles()
      }
    }
  }
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


