<!-- src/views/NotAuthorized.vue -->
<template>
  <v-container class="text-center">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="justify-center"
            >403 - Not Authorized</v-card-title
          >
          <v-card-text>
            <p>You do not have permission to view this page.</p>
            <v-btn color="primary" @click="$router.push('/')"
              >Go to Login</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "NotAuthorized",
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
