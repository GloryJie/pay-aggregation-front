<template>
  <div>
    <Row :gutter="12">
      <Col span="5">
        <Card style="height: 500px" :dis-hover="true">
          <Cascader :data="selectListData" @on-change="selectSubApp" v-model="defaultAppId" change-on-select
                    filterable></Cascader>
          <Button type="primary" style="margin-top: 6px" @click="showAddSubAppModel = true">添加应用</Button>
        </Card>
      </Col>
      <Col span="19">
        <h3>应用信息</h3>
        <Tabs v-model="defaultTabName" @on-click="tabChange">
          <TabPane label="基础信息" name="BaseInfo">
            <Form :model="selectedSubAppInfo" label-position="right" :label-width="100">
              <FormItem label="应用ID">
                <Input v-model="selectedSubAppInfo.appId" disabled></Input>
              </FormItem>
              <FormItem label="应用名">
                <Input v-model="selectedSubAppInfo.name" disabled></Input>
              </FormItem>
              <FormItem label="应用描述">
                <Input v-model="selectedSubAppInfo.description" type="textarea" disabled
                       :autosize="{minRows: 3,maxRows: 5}"></Input>
              </FormItem>
            </Form>
          </TabPane>

          <TabPane label="交易配置" name="TradeConfig">

            <app-trade-config v-if="showSubTradeConfig" :appId="selectedSubAppInfo.appId"/>

          </TabPane>
          <TabPane label="通知配置" name="NotifyConfig">
            <notify-url-config v-if="showSubNotifyConfig" :appId="selectedSubAppInfo.appId"/>
          </TabPane>
        </Tabs>
      </Col>
    </Row>

    <Modal v-model="showAddSubAppModel" fullscreen :title="appPathName">
      <sub-app-create-step @end-step="createSubAppStepEnd" :parent-app-id="selectedSubAppInfo.appId"/>
    </Modal>
  </div>
</template>

<script>
  import { getAppTreeRequest } from '@/api/pay-api'
  import { mapGetters } from 'vuex'
  import AppTradeConfig from '@/components/app-trade-config'
  import NotifyUrlConfig from '@/components/notify-url-config'
  import SubAppCreateStep from '@/components/sub-app-create-step'

  export default {
    name: 'edit-merchant',
    components: { AppTradeConfig, NotifyUrlConfig, SubAppCreateStep },
    data () {
      return {
        appIdPath: [],
        showAddSubAppModel: false,
        defaultTabName: 'BaseInfo',
        defaultAppId: [this.selectedAppId],
        showSubTradeConfig: false,
        showSubNotifyConfig: false,
        selectedSubAppInfo: {
          appId: this.selectedAppId
        },
        showOverview: false,
        chartData: {},
        selectListData: [],
        treeData: [],
        dataList: []
      }
    },
    methods: {
      getAppTreeListData () {
        getAppTreeRequest(this.selectedAppId).then(res => {
          this.dataList = res.data
          this.buildTreeData(res.data)
        })
      },
      buildTreeData (data) {
        data.forEach(item => {
          item.title = item.name
          item.expand = false
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
        // todo 应该找数组用层级最小的
        const root = data.find(item => item.type === 'MASTER')
        this.treeData = root.children
        this.selectListData = [root]
        this.chartData = root
        // 默认第一个
        this.selectedSubAppInfo = Object.assign({}, this.selectedSubAppInfo, root)
      },
      selectSubApp (value, selectedData) {
        // value 和 selectedData都为数组, 这里只要选择最后一个即可
        this.appIdPath = value
        const appId = value[value.length - 1]
        for (let index in this.dataList) {
          if (appId == this.dataList[index].appId) {
            this.selectedSubAppInfo = Object.assign({}, this.selectedSubAppInfo, this.dataList[index])
            break
          }
        }
        this.defaultTabName = 'BaseInfo'
      },
      tabChange (name) {
        if (name == 'TradeConfig') {
          this.showSubTradeConfig = true
          this.showSubNotifyConfig = false
        } else if (name == 'NotifyConfig') {
          this.showSubNotifyConfig = true
          this.showSubTradeConfig = false
        } else {
          this.showSubTradeConfig = false
          this.showSubNotifyConfig = false
        }
      },
      createSubAppStepEnd(){
        this.showAddSubAppModel = false;
        this.getAppTreeListData()
      }
    },
    computed: {
      ...mapGetters({
        selectedAppId: 'getSelectedAppId'
      }),
      appPathName () {
        // 从根节点到要创建的路径名
        let path = ''
        for (let i in this.appIdPath) {
          for (let j in this.dataList) {
            if (this.appIdPath[i] == this.dataList[j].appId) {
              path = path + this.dataList[j].name + '/'
              continue
            }
          }
        }
        return `创建 ${path} 下的子商户`
      }
    },
    mounted () {
      this.getAppTreeListData()
      this.defaultAppId = [this.selectedAppId]
      this.appIdPath = [this.defaultAppId]
    }
  }
</script>

<style scoped>

</style>
