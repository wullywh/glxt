<template>
  <div>wellcome</div>
</template>

<script>
export default {
  // inject: ["reload"],
  props: {},
  data() {
    return {};
  },
  methods: {},
  components: {},
  mounted() {
    sessionStorage.removeItem("index");
    // location.reload();
  },
};
</script>

<style scoped lang="scss">
</style>
