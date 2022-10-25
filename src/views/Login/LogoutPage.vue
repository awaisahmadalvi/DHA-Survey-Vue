<template>
  <v-app> LOGOUT Successful... </v-app>
</template>

<script>
export default {
  name: "LogoutPage",
  data: () => ({}),
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push({ name: "Login" });
    },
  },
  created() {
    this.logout();
  },
  watch: {},
  computed: {},
};
</script>