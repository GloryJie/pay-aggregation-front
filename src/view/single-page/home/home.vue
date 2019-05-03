<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="14" :md="8" :lg="6" v-for="(infor, i) in todayTradeData" :key="`infor-${i}`"
             style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" ref="platformPieViewRef" :value="platformData" text="交易平台分布"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" ref="channelPieViewRef" :value="channelData" text="Top3渠道"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" ref="subAppPieViewRef" :value="subAppData" text="Top5子商户交易"></chart-pie>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example
          ref="tradeHistoryLineViewRef"
          :x-array="xDateHistory"
          :y-success-amount-array="ySuccessAmountData"
          :y-success-count-array="ySuccessCountData"
          style="height: 350px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
  import {
    getTodayTradeStatRequest,
    getTradeHistoryStatRequest,
    getChannelTradeStatRequest,
    getSubAppTradeStatRequest
  } from '@/api/pay-api'
  import {
    transformChannel
  } from '@/libs/StatusTransform'
  import InforCard from '_c/info-card'
  import CountTo from '_c/count-to'
  import { ChartPie, ChartBar } from '_c/charts'
  import Example from './example.vue'
  import { mapGetters } from 'vuex'

  export default {
    name: 'home',
    components: {
      InforCard,
      CountTo,
      ChartPie,
      ChartBar,
      Example
    },
    data () {
      return {
        todayTradeData: [
          { title: '成功交易金额', icon: 'md-person-add', count: 803, color: '#19be6b', key: 'successAmount' },
          { title: '成功交易笔数', icon: 'md-locate', count: 232, color: '#19be6b', key: 'successCount' },
          { title: '交易中金额', icon: 'md-help-circle', count: 142, color: '#ff9900', key: 'processAmount' },
          { title: '交易中笔数', icon: 'md-help-circle', count: 657, color: '#ff9900', key: 'processCount' }
        ],
        platformData: [
          { value: 0, name: '支付宝', key: 'ALIPAY' },
          { value: 0, name: '微信', key: 'WXPAY' },
          { value: 0, name: '银联', key: 'UNIONPAY' }
        ],
        channelData: [
          { value: 0, name: '支付宝', key: 'ALIPAY' },
          { value: 0, name: '微信', key: 'WXPAY' },
          { value: 0, name: '银联', key: 'UNIONPAY' }
        ],
        subAppData: [
          { value: 0, name: '暂无', platformType: '无' }
        ],
        // x轴的日期排列
        xDateHistory: [],
        // y轴的历史交易记录
        ySuccessCountData: [],
        ySuccessAmountData: []
      }
    },
    methods: {
      getTodayTradeData () {
        // 获取今日交易数据统计
        getTodayTradeStatRequest(this.selectedAppId).then(res => {
          let data = res.data
          this.todayTradeData.forEach(item => {
            if (item.key.indexOf('Amount')>0){
              item.count = parseInt(data[item.key]/100)
            } else{
              item.count = data[item.key]
            }
          })
        })
      },
      getChannelTradeStatData () {
        getChannelTradeStatRequest(this.selectedAppId).then(res => {
          let dataArray = res.data
          this.platformData.forEach(item => {
            for (let i = 0; i < dataArray.length; i++) {
              if (item.key == dataArray[i].platformType) {
                item.value += parseInt(dataArray[i].successAmount / 100)
              }
            }
          })
          let topChannelData = dataArray.slice(0, 3).filter(item => item.succeAmount != 0)
          topChannelData.forEach(item => {
            item.name = transformChannel(item.channelType)
            item.value = parseInt(item.successAmount / 100)
          })
          this.channelData = topChannelData
          this.$refs.platformPieViewRef.refreshView()
          this.$refs.channelPieViewRef.refreshView()
        })
      },
      getSubAppTradeStatData () {
        getSubAppTradeStatRequest(this.selectedAppId).then(res => {
          let dataArray = res.data
          if (dataArray.length > 3) {
            dataArray = dataArray.slice(0, 3)
          }
          dataArray.forEach(item => {
            item.name = item.appId
            item.value = parseInt(item.successAmount / 100)
          })
          this.subAppData = dataArray
          this.$refs.subAppPieViewRef.refreshView()
        })
      },
      getTradeHistoryStatData () {
        getTradeHistoryStatRequest(this.selectedAppId).then(res => {
          let dataArray = res.data
          let xArray = []
          let yAmount = []
          let yCount = []
          if (dataArray.length > 30) {
            dataArray.slice(0, 30)
          }
          dataArray.forEach(item => {
            xArray.push(item.statisticsDay)
            yAmount.push(parseInt(item.successAmount/100))
            yCount.push(parseInt(item.successCount))
          })
          this.xDateHistory = xArray.reverse()
          this.ySuccessAmountData = yAmount.reverse()
          this.ySuccessCountData = yCount.reverse()
          this.$refs.tradeHistoryLineViewRef.refreshView()
        })
      }
    },
    computed: {
      ...mapGetters({
        selectedAppId: 'getSelectedAppId'
      })
    },
    mounted () {
      this.getTodayTradeData()
      this.getChannelTradeStatData()
      this.getSubAppTradeStatData()
      this.getTradeHistoryStatData()
    }
  }
</script>

<style lang="less">
  .count-style {
    font-size: 50px;
  }
</style>
