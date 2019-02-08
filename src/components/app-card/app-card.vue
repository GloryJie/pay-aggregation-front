<template>
  <Card class="app-card">
    <div class="card-header">
      <Icon :type="icon" size="64"/>
      <h2 class="app-name">{{this.name}}</h2>
      <p>appId: {{this.appId}}</p>
    </div>
    <Divider/>
    <div class="card-operation">
      <Row type="flex" class="card-pannel" align="middle" justify="center">
        <Col span="11" class="sub-pannel">
          <Card :bordered="false" :dis-hover="true" class="sub-operation" :padding="30" @click.native.stop="checkTadeOperation">
            <div style="text-align:center">
              <Icon type="logo-buffer" class="operation-icon"/>
              <P>交易查看</P>
            </div>
          </Card>
        </Col>
        <Divider type="vertical" class="pannel-divider"/>
        <Col span="11" class="sub-pannel">
          <!-- <Icon type="md-settings" class="operation-icon"/>
          <P>渠道配置</P>-->
          <Card :bordered="false" :dis-hover="true" class="sub-operation" :padding="30" @click.native.stop="channelConfigOperation">
            <div style="text-align:center">
              <Icon type="md-settings" class="operation-icon"/>
              <p>渠道配置</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  </Card>
</template>

<script>
export default {
  props: {
    name: String, // 应用名
    appId: Number, // 应用id
    icon: {
      type: String,
      required: false,
      default: "ios-cube"
    } //应用图标
  },
  methods:{
    checkTadeOperation(){
      this.$emit('Check_Trade_Operation',this.appId);
    },
    channelConfigOperation(){
      this.$emit('Channel_Config_Operation',this.appId);
    }
  }
};
</script>

<style lang="stylus" scoped>
.app-card
  width 300px
  height 350px
  .card-header
    text-align center
    height 130px
    .app-name
      margin-top 20px
  .card-operation
    text-align center
    .card-pannel
      height 120px
      .pannel-divider
        height 120px
      .sub-pannel
        .sub-operation
          :hover
            background-color #dddddd
          .operation-icon
            font-size 32px
</style>







