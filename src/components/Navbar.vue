<!-- eslint-disable vue/multi-word-component-names -->
<!-- src/components/Navbar.vue -->
<template>
  <v-app-bar app color="primary" dark>
    <!-- Clickable Dashboard Title -->
    <v-toolbar-title @click="goToDashboard" class="clickable-title">
      Dashboard
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text @click="logout">Logout</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Navbar",
  methods: {
    goToDashboard() {
      const userType = this.$store.getters.userType;
      if (userType === "Writer") {
        this.$router.push({ name: "WriterDashboard" });
      } else if (userType === "Editor") {
        this.$router.push({ name: "EditorDashboard" });
      } else {
        // Fallback to Login if user type is undefined or role is not recognized
        this.$router.push({ name: "Login" });
      }
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style scoped>
.clickable-title {
  cursor: pointer;
}
.clickable-title:hover {
  text-decoration: underline;
}
</style>
