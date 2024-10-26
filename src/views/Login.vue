<!-- eslint-disable vue/multi-word-component-names -->
<!-- src/views/Login.vue -->
<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="justify-center">Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                label="Email"
                v-model="email"
                required
                type="email"
              ></v-text-field>
              <v-text-field
                label="Password"
                v-model="password"
                required
                type="password"
              ></v-text-field>
              <v-btn type="submit" color="primary" block>Login</v-btn>
            </v-form>
            <v-alert v-if="error" type="error" dense>{{ error }}</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        await this.$store.dispatch("login", {
          email: this.email,
          password: this.password,
        });
        const userType = this.$store.getters.userType;
        if (userType === "Writer") {
          this.$router.push({ name: "WriterDashboard" });
        } else if (userType === "Editor") {
          this.$router.push({ name: "EditorDashboard" });
        }
      } catch (err) {
        this.error = "Invalid email or password";
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
