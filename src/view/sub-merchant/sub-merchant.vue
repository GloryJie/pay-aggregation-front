<template>
  <div>
    <vo-basic :data="chartData" :pan="true" :depth="5" :toggleSiblingsResp="true"></vo-basic>
  </div>
</template>

<script>
  import { getAppTreeRequest } from '@/api/pay-api'
  import { VoBasic } from 'vue-orgchart'
  import { mapGetters } from 'vuex'

  export default {
    name: 'sub-merchant',
    components: { VoBasic },
    data () {
      return {
        chartData: {},
        treeData: []
      }
    },
    methods: {
      getTreeData () {
        getAppTreeRequest(this.selectedAppId).then(res => {
          this.buildTreeData(res.data)
        })
      },
      buildTreeData (data) {
        // 转换后台数据为组件可识别数据
        for (let i = 0; i < data.length; i++) {
          data[i].children = []
          for (let j = 0; j <data.length; j++) {
            if (data[i].appId === data[j].parentAppId) {
              data[i].children.push(data[j])
            }
          }
        }
        // todo 应该找数组用层级最小的
        const root = data.find(item => item.type === 'MASTER')
        this.chartData = root
      }
    },
    computed: {
      ...mapGetters({
        selectedAppId: 'getSelectedAppId'
      })
    },
    mounted () {
      this.getTreeData()
    }
  }
</script>

<style scoped>

</style>
