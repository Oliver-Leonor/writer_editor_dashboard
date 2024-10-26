<!-- src/views/CreateArticle.vue -->
<template>
  <v-container>
    <h1>Create New Article</h1>
    <v-form @submit.prevent="createArticle">
      <v-select
        v-model="selectedCompany"
        :items="companies"
        item-text="name"
        item-value="_id"
        label="Related Company"
        required
      ></v-select>

      <v-file-input
        v-model="image"
        label="Article Image"
        prepend-icon="mdi-camera"
        required
        @change="handleImageChange"
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
import apiClient from "@/plugins/axios";

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
        const response = await apiClient.get("/companies");
        this.companies = response.data;
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    },
    async handleImageChange(file) {
      if (!file) {
        this.error = "Please select an image.";
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        this.error = "Only JPEG, PNG, and GIF files are allowed.";
        this.image = null;
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.error = "Image size should be less than 5MB.";
        this.image = null;
        return;
      }

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await apiClient.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          this.imageUrl = response.data.imageUrl;
          this.error = "";
        } else {
          this.error = response.data.message || "Image upload failed.";
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        this.error = "Image upload failed.";
      }
    },
    async createArticle() {
      if (!this.imageUrl) {
        this.error = "Please upload an image.";
        return;
      }
      try {
        const newArticle = {
          imageUrl: this.imageUrl, // Use imageUrl from upload response
          title: this.title,
          link: this.link,
          date: this.date,
          content: this.content,
          companyId: this.selectedCompany,
        };
        await apiClient.post("/articles", newArticle);
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
