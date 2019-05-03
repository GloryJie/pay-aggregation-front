<template>
  <notify-url-config :appId="selectedAppId"/>
</template>

<script>
  import NotifyUrlConfig from '@/components/notify-url-config'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      NotifyUrlConfig
    },
    computed: {
      ...mapGetters({
        selectedAppId: 'getSelectedAppId'
      })
    }
  }
</script>
