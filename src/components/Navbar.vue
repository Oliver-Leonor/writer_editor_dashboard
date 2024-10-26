<!-- eslint-disable vue/multi-word-component-names -->
<!-- src/components/Navbar.vue -->
<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>Dashboard</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text @click="logout">Logout</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Navbar",
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
