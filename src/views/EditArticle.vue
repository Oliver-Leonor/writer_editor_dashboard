<!-- src/views/EditArticle.vue -->
<template>
  <v-container>
    <h1>Edit Article</h1>
    <v-form @submit.prevent="updateArticle">
      <v-select
        v-model="selectedCompany"
        :items="companies"
        item-text="name"
        item-value="id"
        label="Related Company"
        required
      ></v-select>

      <v-file-input
        v-model="image"
        label="Article Image"
        prepend-icon="mdi-camera"
        required
        @change="handleImageUpload"
      ></v-file-input>
      <v-img v-if="imageUrl" :src="imageUrl" max-width="200"></v-img>

      <v-text-field v-model="title" label="Title" required></v-text-field>

      <v-text-field
        v-model="link"
        label="Link"
        required
        type="url"
      ></v-text-field>

      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            label="Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            required
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" @input="menu = false"></v-date-picker>
      </v-menu>

      <vue3-quill v-model="content" />

      <v-btn type="submit" color="primary">Save</v-btn>
      <v-btn color="green" @click="publishArticle">Publish</v-btn>
    </v-form>
    <v-alert v-if="error" type="error" dense>{{ error }}</v-alert>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "EditArticle",
  data() {
    return {
      articleId: this.$route.params.id,
      selectedCompany: null,
      companies: [],
      image: null,
      imageUrl: "",
      title: "",
      link: "",
      date: "",
      menu: false,
      content: "",
      status: "",
      error: "",
    };
  },
  methods: {
    async fetchCompanies() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/companies",
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        );
        this.companies = response.data;
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    },
    async fetchArticle() {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/articles/${this.articleId}`,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        );
        const article = response.data;
        this.selectedCompany = article.company.id;
        this.imageUrl = article.image;
        this.title = article.title;
        this.link = article.link;
        this.date = article.date;
        this.content = article.content;
        this.status = article.status;
      } catch (error) {
        console.error("Error fetching article:", error);
        this.error = "Failed to fetch article.";
      }
    },
    async handleImageUpload(file) {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async updateArticle() {
      try {
        const updatedArticle = {
          image: this.imageUrl || "",
          title: this.title,
          link: this.link,
          date: this.date,
          content: this.content,
          companyId: this.selectedCompany,
          status: this.status,
        };
        await axios.put(
          `http://localhost:5000/api/articles/${this.articleId}`,
          updatedArticle,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        );
        this.$router.push({ name: "WriterDashboard" });
      } catch (error) {
        console.error("Error updating article:", error);
        this.error = "Failed to update article.";
      }
    },
    async publishArticle() {
      try {
        const updatedArticle = {
          status: "Published",
        };
        await axios.put(
          `http://localhost:5000/api/articles/${this.articleId}`,
          updatedArticle,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        );
        this.$router.push({ name: "EditorDashboard" });
      } catch (error) {
        console.error("Error publishing article:", error);
        this.error = "Failed to publish article.";
      }
    },
  },
  created() {
    this.fetchCompanies();
    this.fetchArticle();
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
