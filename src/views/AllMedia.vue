<!-- eslint-disable vue/valid-v-slot -->
<!-- src/views/AllMedia.vue -->
<template>
  <v-container>
    <h1>All Media</h1>
    <v-data-table :headers="headers" :items="articles" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Articles</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:item.image="{ item }">
        <v-img :src="item.image" max-width="100" contain></v-img>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn color="blue" small @click="editArticle(item.id)">Edit</v-btn>
        <v-btn v-if="isEditor" color="red" small @click="deleteArticle(item.id)"
          >Delete</v-btn
        >
      </template>
    </v-data-table>
    <v-alert v-if="error" type="error" dense>{{ error }}</v-alert>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "AllMedia",
  data() {
    return {
      articles: [],
      headers: [
        { text: "Image", value: "image" },
        { text: "Title", value: "title" },
        { text: "Link", value: "link" },
        { text: "Date", value: "date" },
        { text: "Writer", value: "writer.firstname" },
        { text: "Editor", value: "editor.firstname" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      error: "",
    };
  },
  computed: {
    isEditor() {
      return this.$store.getters.userType === "Editor";
    },
  },
  methods: {
    async fetchArticles() {
      try {
        const response = await axios.get("http://localhost:5000/api/articles", {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        });
        this.articles = response.data;
      } catch (error) {
        console.error("Error fetching articles:", error);
        this.error = "Failed to fetch articles.";
      }
    },
    editArticle(id) {
      this.$router.push(`/edit-article/${id}`);
    },
    async deleteArticle(id) {
      if (confirm("Are you sure you want to delete this article?")) {
        try {
          await axios.delete(`http://localhost:5000/api/articles/${id}`, {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          });
          this.fetchArticles();
        } catch (error) {
          console.error("Error deleting article:", error);
          this.error = "Failed to delete article.";
        }
      }
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
