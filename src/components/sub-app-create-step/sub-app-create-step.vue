<template>
  <div>
    <Row type="flex" justify="center" align="middle">
      <Col span="18" push="1">
        <Steps :current="current">
          <Step title="基本信息" content="添加子商户的基本信息"></Step>
          <Step title="交易配置" content="子商户的交易钥对"></Step>
          <Step title="通知接收配置" content="子商户接收异步通知地址"></Step>
        </Steps>
      </Col>
    </Row>

    <Row type="flex" justify="center" align="middle" v-if="current === 0" style="margin-top: 30px">
      <Col span="10" pull="1">
        <div>
          <Form ref="newAppForm" :model="newAppParam" :rules="rules" :label-width="100">
            <FormItem label="应用名称：" prop="name">
              <Input v-model="newAppParam.name"/>
            </FormItem>

            <FormItem label="应用描述：" prop="description">
              <Input v-model="newAppParam.description" type="textarea" :rows="10"/>
            </FormItem>
          </Form>

        </div>
      </Col>
    </Row>

    <Row type="flex" justify="center" align="middle" v-if="current === 1" style="margin-top: 30px">
      <Col span="20" pull="2">
        <div v-show="current === 1">
          <app-trade-config ref="tradeConfig" v-if="newAppParam.appId != ''" :appId="newAppParam.appId"
                            :hide-confirm-btn="true"/>
        </div>
      </Col>
    </Row>

    <Row type="flex" justify="center" align="middle" v-if="current === 2" style="margin-top: 30px">
      <Col span="18" push="1">
        <div v-show="current === 2">
          <notify-url-config v-if="newAppParam.appId != ''" :appId="newAppParam.appId"/>
        </div>
      </Col>
    </Row>


    <Row type="flex" justify="center" align="middle">
      <Col>
        <Button type="primary" @click="next">下一步</Button>
      </Col>
    </Row>
  </div>

</template>

<script>
  import { addNewSubAppRequest } from '@/api/pay-api'
  import NotifyUrlConfig from '@/components/notify-url-config'
  import AppTradeConfig from '@/components/app-trade-config'
  import CollapsedMenu from '../main/components/side-menu/collapsed-menu'

  export default {
    name: 'sub-app-create-step',
    props: {
      parentAppId: {
        required: true
      }
    },
    components: {
      CollapsedMenu,
      NotifyUrlConfig,
      AppTradeConfig
    },
    data () {
      return {
        current: 0,
        newAppParam: {
          name: '',
          description: '',
          appId: ''
        },
        rules: {
          name: [
            {
              required: true,
              min: 2,
              max: 32,
              message: '应用名称至少2个字,至多16',
              trigger: 'blur'
            }
          ],
          description: [
            {
              required: true,
              min: 4,
              max: 100,
              message: '应用描述至少4个字,至多100',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      next () {
        if (this.current == 0) {
          this.$refs['newAppForm'].validate(valid => {
            if (valid) {
              addNewSubAppRequest(this.parentAppId, this.newAppParam)
                .then(res => {
                  let data = res.data
                  this.newAppParam.appId = data.appId
                  this.$Notice.success({
                    title: '创建应用成功',
                    desc: '请进行相应配置'
                  })
                  this.current += 1
                })
                .catch(res => {
                })
            }
          })
        } else if (this.current == 2) {
          this.newAppParam.name = ''
          this.newAppParam.description = ''
          this.appId = ''
          this.current = 0
          this.$emit('end-step')
        } else {
          this.current += 1
        }

      }
    }

  }
</script>

<style scoped>

</style>
