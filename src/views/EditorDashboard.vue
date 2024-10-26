<!-- src/views/EditorDashboard.vue -->
<template>
  <v-container>
    <h1>Editor Dashboard</h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>For Publish</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="article in forPublishArticles"
                :key="article.id"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ article.title }}</v-list-item-title>
                  <v-list-item-subtitle>
                    By: {{ article.writer.firstname }}
                    {{ article.writer.lastname }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn color="blue" @click="editAndPublishArticle(article.id)"
                    >Edit & Publish</v-btn
                  >
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Published</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="article in publishedArticles"
                :key="article.id"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ article.title }}</v-list-item-title>
                  <v-list-item-subtitle>
                    By: {{ article.writer.firstname }}
                    {{ article.writer.lastname }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "EditorDashboard",
  data() {
    return {
      articles: [], // This should be fetched from the backend
    };
  },
  computed: {
    forPublishArticles() {
      return this.articles.filter((article) => article.status === "For Edit");
    },
    publishedArticles() {
      return this.articles.filter((article) => article.status === "Published");
    },
  },
  methods: {
    editAndPublishArticle(id) {
      this.$router.push(`/edit-article/${id}`);
    },
    fetchArticles() {
      axios
        .get("http://localhost:5000/api/articles", {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        })
        .then((response) => {
          this.articles = response.data;
        })
        .catch((error) => {
          console.error("Error fetching articles:", error);
        });
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
