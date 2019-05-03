<template>
  <div style="margin-top: 50px">
    <Form
      :label-width="100"
      v-for="(item,index) in eventTypeList"
      :key="item.eventType"
      :model="item"
      :rules="rules"
      :ref="item.eventType"
    >
      <Row type="flex" justify="center" align="middle">
        <Col span="8" :xs="2" :sm="4" :md="6" :lg="12">
          <FormItem :label="item.eventTypeCN" prop="notifyUrl">
            <Input placeholder="事件通知地址" v-model="item.notifyUrl">
              <Select slot="prepend" style="width: 80px" v-model="item.httpType">
                <Option value="http://">http://</Option>
                <Option value="https://">https://</Option>
              </Select>
              <Button
                icon="ios-refresh-circle-outline"
                slot="append"
                style="padding: 1px 10px;font-size: 18px"
                @click="updateNotifyUrl(item)"
              ></Button>
            </Input>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="状态：">
            <i-switch size="large" v-model="item.status" @on-change="changeSubscribeStatus(item)">
              <span slot="open">已订</span>
              <span slot="close">未订</span>
            </i-switch>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Row type="flex" justify="center" align="middle" style="margin-top: 20px">
      <Col span="12">
        <p>不同的事件类型可以使用相同的地址，地址不能包含参数，只能是纯粹的url地址</p>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {
    addOrUpdateEventSubscriptionRequest,
    getEventSubscriptionRequest,
    deleteEventSubscriptionRequest
  } from '@/api/pay-api'

  export default {
    name: 'NotifyConfig',
    props:{
      appId:{
        required: true
      }
    },
    data () {
      return {
        eventTypeList: [
          {
            eventType: 'CHARGE_CHANGE_EVENT',
            eventTypeCN: '支付成功事件:',
            notifyUrl: '',
            status: false,
            httpType: 'https://'
          },
          {
            eventType: 'REFUND_CHANGE_EVENT',
            eventTypeCN: '退款成功事件:',
            notifyUrl: '',
            status: false,
            httpType: 'https://'
          }
        ],
        rules: {
          notifyUrl: [
            {
              required: true,
              message: '通知地址不能为空',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      changeSubscribeStatus (event) {
        let param = {}
        param.notifyUrl = event.httpType + event.notifyUrl
        param.eventType = event.eventType
        if (event.status) {
          // 开通订阅
          this.$refs[event.eventType][0].validate(valid => {
            if (!valid) {
              // 稍后再刷新dom，立即更新不会生效
              this.$nextTick(() => {
                event.status = false
              }, 20)
            } else {
              this.addOrUpdateSunscription(this.appId, param)
            }
          })
        } else {
          let self = this
          // 取消订阅
          this.$Modal.confirm({
            title: '确认取消当前订阅的事件吗',
            content: '取消成功后正在进行的通知事件不会停止',
            onOk () {
              self.deleteEventSubscribe(self.appId, event)
            },
            onCancel () {
              this.$nextTick(() => {
                event.status = true
              }, 20)
            }
          })
        }
      },
      deleteEventSubscribe (appId, event) {
        deleteEventSubscriptionRequest(appId, event.eventType)
          .then(res => {
            let data = res.data
            if (data) {
              // 修改本地数据
              this.$nextTick(() => {
                event.status = false
                event.httpType = 'https://'
                event.notifyUrl = ''
              }, 20)
              this.$Notice.success({
                title: '取消订阅事件成功'
              })
            }
          })
          .catch(err => {
          })
      },
      addOrUpdateSunscription (appId, param) {
        addOrUpdateEventSubscriptionRequest(appId, param)
          .then(res => {
            let data = res.data
            this.alterEventList(data)
            this.$Notice.success({
              title: '配置事件通知成功'
            })
          })
          .catch(err => {
            let target = this.eventTypeList.find(item => item.eventType === param.eventType)
            target.notifyUrl = ''
            target.status = false
          })
      },
      alterEventList (eventObject) {
        let target = this.eventTypeList.find(
          item => item.eventType === eventObject.eventType
        )
        target.status = true
        if (eventObject.notifyUrl.includes('https://')) {
          target.httpType = 'https://'
          target.notifyUrl = eventObject.notifyUrl.slice(
            'https://'.length,
            eventObject.notifyUrl.length
          )
        } else {
          target.httpType = 'http://'
          target.notifyUrl = eventObject.notifyUrl.slice(
            'http://'.length,
            eventObject.notifyUrl.length
          )
        }
      },
      getSubscribeEvent () {
        getEventSubscriptionRequest(this.appId)
          .then(res => {
            let data = res.data
            for (let key in data) {
              this.alterEventList(data[key])
            }
          })
          .catch(res => {})
      },
      updateNotifyUrl (event) {
        let param = {}
        param.eventType = event.eventType
        param.notifyUrl = event.httpType + event.notifyUrl

        this.addOrUpdateSunscription(this.appId, param)
      }
    },
    mounted () {
      this.getSubscribeEvent()
    }
  }
</script>
