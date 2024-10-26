<!-- eslint-disable vue/multi-word-component-names -->
<!-- src/components/Layout.vue -->
<template>
  <v-app>
    <Navbar v-if="showNavbar" />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./Navbar.vue";
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Layout",
  components: {
    Navbar,
  },
  setup() {
    const store = useStore();
    // eslint-disable-next-line no-unused-vars
    const route = useRoute();

    const showNavbar = computed(() => store.getters.isAuthenticated);

    return {
      showNavbar,
    };
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
