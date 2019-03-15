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
        <Content class="content-wrapper" style="padding: 10px 60px">
          <Row type="flex" justify="center">
            <Col span="5" v-for="item in appList" :key="item.appId">
              <app-card
                :name="item.name"
                :appId="item.appId"
                @click.native="handleSelectedApp(item.appId)"
                @Check_Trade_Operation="handleTradeOperation"
                @Channel_Config_Operation="handleChannelConfigOperation"
                style="margin-top: 18px"
              ></app-card>
            </Col>

            <Col span="6">
              <Card
                class="add-app-card"
                @click.native="showAddAppDrawer = true"
                style="margin-top: 18px"
              >
                <Icon type="ios-add-circle" class="icon"/>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
      <div>
        <Drawer title="创建新应用" v-model="showAddAppDrawer" :mask-closable="true" width="450">
          <Form ref="newAppForm" :model="newAppParam" :rules="rules" :label-width="100">
            <FormItem label="应用名称：" prop="name">
              <Input v-model="newAppParam.name"/>
            </FormItem>

            <FormItem label="应用描述：" prop="description">
              <Input v-model="newAppParam.description" type="textarea" :rows="10"/>
            </FormItem>
          </Form>

          <div class="drawer-footer">
            <Button style="margin-right: 10px" @click="showAddAppDrawer = false">取消</Button>
            <Button type="primary" @click="confirmAddNewAPP">确定</Button>
          </div>
        </Drawer>
      </div>
    </Content>
  </Layout>
</template>


<script>
import User from "@/components/main/components/user";
import Fullscreen from "@/components/main/components/fullscreen";
import { mapMutations, mapActions, mapGetters } from "vuex";
import { getNewTagList, getNextRoute, routeEqual } from "@/libs/util";
import { getAppMasterListRequest, addNewAppRequest } from "@/api/pay-api";
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
      appList: [],
      showAddAppDrawer: false,
      newAppParam: {
        name: "",
        description: ""
      },
      rules: {
        name: [
          {
            required: true,
            min: 2,
            max: 32,
            message: "应用名称至少2个字,至多16",
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            min: 4,
            max: 100,
            message: "应用描述至少4个字,至多100",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    userAvator() {
      return this.$store.state.user.avatorImgPath;
    }
  },
  methods: {
    ...mapMutations(["setSelectedAppId", "setSelectedApp"]),
    handleSelectedApp(appId) {
      this.handleSelected(appId);
      this.$router.push({ name: "AppHome", params: { appId } });
    },
    handleTradeOperation(appId) {
      this.handleSelected(appId);
      this.$router.push({ name: "ChargeManage", params: { appId } });
    },
    handleChannelConfigOperation(appId) {
      this.handleSelected(appId);
      this.$router.push({ name: "ChannelConfig", params: { appId } });
    },
    handleSelected(appId) {
      this.setSelectedAppId(appId);
      let app = this.appList.find(item => item.appId === appId);
      this.setSelectedApp(app);
    },
    getAppMasterList() {
      getAppMasterListRequest()
        .then(res => {
          let data = res.data;
          this.appList = data;
        })
        .catch(res => {});
    },
    confirmAddNewAPP() {
      this.$refs["newAppForm"].validate(valid => {
        if (valid) {
          addNewAppRequest(this.newAppParam)
            .then(res => {
              let data = res.data;
              this.appList.push(data);
              this.showAddAppDrawer = false;
              this.$Notice.success({
                title: "创建应用成功",
                desc: "请前往应用主页进行相应配置"
              });
            })
            .catch(res => {});
        }
      });
    }
  },
  mounted() {
    this.getAppMasterList();
  }
};
</script>

<style lang="stylus" scoped>
.main
  .logo-con
    height 64px
    padding 10px
    img
      height 44px
      width auto
      display block
      margin 0 auto
  .main-content-con
    overflow hidden
    .content-wrapper
      margin-top 20px
      .add-app-card
        width 300px
        height 350px
        text-align center
        font-size 130px
        line-height 270px
.drawer-footer
  width 450px
  position fixed
  bottom 0
  right 0
  border-top 1px solid #e8e8e8
  padding 10px 16px
  text-align right
  background #fff
</style>

