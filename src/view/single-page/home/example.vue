<template>
  <div ref="dom"></div>
</template>

<script>
  import echarts from 'echarts'
  import { on, off } from '@/libs/tools'

  export default {
    name: 'serviceRequests',
    props: {
      xArray: {
        type: Array,
        default () {
          return ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      },
      ySuccessAmountArray: {
        type: Array,
        default () {
          return [120, 132, 101, 134, 90, 230, 210]
        }

      },
      ySuccessCountArray: {
        type: Array,
        default(){
          return [12, 13, 10, 13, 9, 23, 21]
        }
      }
    },
    data () {
      return {
        dom: null
      }
    },
    methods: {
      resize () {
        this.dom.resize()
      },
      refreshView(){
        this.$nextTick(()=>{
          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            grid: {
              top: '3%',
              left: '1.2%',
              right: '1%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: this.xArray
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            toolbox :{
              feature: {
                magicType: {type: ['line', 'bar']},
                saveAsImage: {}
              }
            },
            series: [
              {
                name: '交易金额',
                type: 'line',
                areaStyle: {
                  normal: {
                    color: '#2d8cf0'
                  }
                },
                data: this.ySuccessAmountArray
              },
              {
                name: '交易笔数',
                type: 'line',
                areaStyle: {
                  normal: {
                    color: '#2d8cf0'
                  }
                },
                data: this.ySuccessCountArray
              }
            ]
          }
          this.dom.setOption(option)
        })
      }
    },
    mounted () {
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          top: '3%',
          left: '1.2%',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.xArray
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        toolbox :{
          feature: {
            magicType: {type: ['line', 'bar']},
            saveAsImage: {}
          }
        },
        series: [
          {
            name: '交易金额',
            type: 'line',
            areaStyle: {
              normal: {
                color: '#2d8cf0'
              }
            },
            data: this.ySuccessAmountArray
          },
          {
            name: '交易笔数',
            type: 'line',
            areaStyle: {
              normal: {
                color: '#2d8cf0'
              }
            },
            data: this.ySuccessCountArray
          }
        ]
      }
      this.$nextTick(() => {
        this.dom = echarts.init(this.$refs.dom)
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    },
    beforeDestroy () {
      off(window, 'resize', this.resize)
    }
  }
</script>
