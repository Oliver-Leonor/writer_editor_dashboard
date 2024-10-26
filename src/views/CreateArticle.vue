<!-- src/views/CreateArticle.vue -->
<template>
  <v-container>
    <h1>Create New Article</h1>
    <v-form @submit.prevent="createArticle">
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

      <v-btn type="submit" color="primary">Submit</v-btn>
    </v-form>
    <v-alert v-if="error" type="error" dense>{{ error }}</v-alert>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "CreateArticle",
  data() {
    return {
      selectedCompany: null,
      companies: [],
      image: null,
      imageUrl: "",
      title: "",
      link: "",
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      content: "",
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
    async handleImageUpload(file) {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async createArticle() {
      if (!this.image) {
        this.error = "Please upload an image.";
        return;
      }
      try {
        const newArticle = {
          image: this.imageUrl,
          title: this.title,
          link: this.link,
          date: this.date,
          content: this.content,
          companyId: this.selectedCompany,
        };
        await axios.post("http://localhost:5000/api/articles", newArticle, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        });
        this.$router.push({ name: "WriterDashboard" });
      } catch (error) {
        console.error("Error creating article:", error);
        this.error = "Failed to create article.";
      }
    },
  },
  created() {
    this.fetchCompanies();
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
