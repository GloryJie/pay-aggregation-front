<template>
  <Layout style="height: 100%" class="main">
    <Header class="header-con">
      <Row>
        <Col span="12">
          <Row type="flex" justify="start">
            <div class="logo-con">
              <img :src="maxLogo" key="max-logo">
            </div>
          </Row>
        </Col>
        <Col span="12">
          <Row type="flex" justify="end">
            <fullscreen v-model="isFullscreen" style="margin-right: 20px"/>

            <user :user-avator="userAvator" style="margin-right: 10px"/>
          </Row>
        </Col>
      </Row>
    </Header>
    <Content class="main-content-con">
      <Layout class="main-layout-con">
        <Content class="content-wrapper">
          <Row type="flex" justify="center">
            <Col span="6" v-for="item in appList" :key="item.appId">
              <app-card
                :name="item.name"
                :appId="item.appId"
                @click.native="handleSelectedApp(item.appId)"
                @Check_Trade_Operation="handleTradeOperation"
                @Channel_Config_Operation="handleChannelConfigOperation"
              ></app-card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Content>
  </Layout>
</template>


<script>
import User from "@/components/main/components/user";
import Fullscreen from "@/components/main/components/fullscreen";
import { mapMutations, mapActions, mapGetters } from "vuex";
import { getNewTagList, getNextRoute, routeEqual } from "@/libs/util";
import minLogo from "@/assets/images/logo-min.jpg";
import maxLogo from "@/assets/images/logo.jpg";
import AppCard from "@/components/app-card";
export default {
  name: "AppList",
  components: {
    Fullscreen,
    User,
    AppCard
  },
  data() {
    return {
      maxLogo,
      isFullscreen: false,
      appList: [
        {
          name: "书店",
          appId: 123456
        },
        {
          name: "咖啡店",
          appId: 987654
        }
      ]
    };
  },
  computed: {
    userAvator() {
      return this.$store.state.user.avatorImgPath;
    }
  },
  methods: {
    ...mapMutations([
      'setSelectedAppId'
    ]),
    handleSelectedApp(appId) {
      this.setSelectedAppId(appId)
      this.$router.push({ name: "AppHome", params: { appId } });
    },
    handleTradeOperation(appId) {
      this.setSelectedAppId(appId)
      this.$router.push({ name: "ChargeManage", params: { appId } });
    },
    handleChannelConfigOperation(appId) {
      this.setSelectedAppId(appId)
      this.$router.push({ name: "ChannelConfig", params: { appId } });
    }
  }
};
</script>

<style lang="less" scoped>
.user-avator {
  float: right;
}
.logo-con {
  height: 64px;
  padding: 10px;
  img {
    height: 44px;
    width: auto;
    display: block;
    margin: 0 auto;
  }
}
.app-list-dropdown {
  font-size: 14px;
}
.main-content-con {
  height: ~"calc(100% - 60px)";
  overflow: hidden;
}
.content-wrapper {
  margin-top: 20px;
}
</style>

