<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger>
    <!-- <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb> -->
    <div class="custom-bread-crumb" style="margin-left: 30px;">
      <BreadcrumbItem :to="{name: 'AppList'}" style="fontSize: 18px;">
        <div style="color: #5b6479">
          <Icon type="ios-home-outline"></Icon>应用列表
        </div>
      </BreadcrumbItem>
    </div>

    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import siderTrigger from "./sider-trigger";
import customBreadCrumb from "./custom-bread-crumb";
import "./header-bar.less";
export default {
  name: "HeaderBar",
  components: {
    siderTrigger,
    customBreadCrumb
  },
  props: {
    collapsed: Boolean
  },
  computed: {
    breadCrumbList() {
      return this.$store.state.app.breadCrumbList;
    }
  },
  methods: {
    handleCollpasedChange(state) {
      this.$emit("on-coll-change", state);
    }
  }
};
</script>
