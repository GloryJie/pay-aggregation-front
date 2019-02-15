<template>
  <div class="container">
    <Card class="channel-card">
      <div class="tip" :class="tipBackgrounpColor">
        <span>{{cornerText}}</span>
      </div>
      <div class="pic-pannel">
        <img class="channel-pic" :src="picAddr">
        <div class="channel-text">
          <h3 class="title">{{product}}</h3>
          <p class="desc">{{desc}}</p>
        </div>
      </div>
    </Card>
  </div>
</template>


<script>
export default {
  props: {
    product: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    channel: {
      type: String,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: false
    },
    isOpened: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      picAddr: require(`../../assets/images/channel/${this.icon}`),
      expectColor: "#ff9900",
      openedColor: "#19be6b",
      notOpenedColor: "#2db7f5"
    };
  },
  computed: {
    cornerText() {
      if (!this.isAvailable) {
        return "敬请期待";
      } else if (this.isOpened) {
        return "已开通";
      } else {
        return "未开通";
      }
    },
    tipBackgrounpColor() {
      if (!this.isAvailable) {
        return "expect";
      } else if (this.isOpened) {
        return "opened";
      } else {
        return "not-open";
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.channel-card
  width 200px
  height 240px
  cursor pointer
  position relative
  overflow hidden
  .expect
    background #ff9900
  .opened
    background #19be6b
  .not-open
    background #2db7f5
  .tip
    width 100px
    height 100px
    position absolute
    top -50px
    right -50px
    transform rotate(45deg)
    span
      color white
      position absolute
      bottom 0
      display block
      width 100px
      text-align center
  .pic-pannel
    text-align center
    .channel-pic
      width 100px
      height 100px
    .channel-text
      margin-top 24px
      .desc
        font-size 12px
        color #9A9A9A
</style>


