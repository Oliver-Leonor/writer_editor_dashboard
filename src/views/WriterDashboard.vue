<!-- src/views/WriterDashboard.vue -->
<template>
  <v-container>
    <h1>Writer Dashboard</h1>
    <v-alert v-if="error" type="error" dense>{{ error }}</v-alert>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>For Edit ({{ forEditCount }})</v-card-title>
          <v-card-text>
            <!-- List of articles for edit -->
            <v-list>
              <v-list-item v-for="article in forEditArticles" :key="article.id">
                <v-list-item-content>
                  <v-list-item-title>{{ article.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    article.date
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>Published ({{ publishedCount }})</v-card-title>
          <v-card-text>
            <!-- List of published articles -->
            <v-list>
              <v-list-item
                v-for="article in publishedArticles"
                :key="article.id"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ article.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    article.date
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-btn color="primary" @click="createNewArticle">Create New Article</v-btn>
  </v-container>
</template>

<script>
import apiClient from "@/plugins/axios";

export default {
  name: "WriterDashboard",
  data() {
    return {
      forEditArticles: [],
      publishedArticles: [],
      forEditCount: 0,
      publishedCount: 0,
      error: "",
    };
  },
  methods: {
    async fetchArticles() {
      try {
        const response = await apiClient.get("/articles");
        const articles = response.data;

        // Filter articles by writer's ID and status
        const writerId = this.$store.state.user.id;
        this.forEditArticles = articles.filter(
          (a) => a.writerId === writerId && a.status === "For Edit"
        );
        this.publishedArticles = articles.filter(
          (a) => a.writerId === writerId && a.status === "Published"
        );

        this.forEditCount = this.forEditArticles.length;
        this.publishedCount = this.publishedArticles.length;
      } catch (err) {
        console.error(
          "Error fetching articles:",
          err.response?.data?.message || err.message
        );
        this.error = "Failed to load articles.";
      }
    },
    createNewArticle() {
      this.$router.push({ name: "CreateArticle" });
    },
  },
  created() {
    this.fetchArticles();
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
