<!-- eslint-disable vue/valid-v-slot -->
<!-- src/views/ManageCompanies.vue -->
<template>
  <v-container>
    <h1>Manage Companies</h1>
    <v-btn color="green" @click="openCreateCompanyDialog"
      >Add New Company</v-btn
    >

    <v-data-table :headers="headers" :items="companies" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Companies</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn color="blue" small @click="editCompany(item)">Edit</v-btn>
      </template>
    </v-data-table>

    <!-- Create/Edit Company Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{
            isEdit ? "Edit Company" : "Create Company"
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            @submit.prevent="isEdit ? updateCompany() : createCompany()"
          >
            <v-text-field
              v-model="company.logo"
              label="Logo URL"
              required
            ></v-text-field>
            <v-text-field
              v-model="company.name"
              label="Company Name"
              required
            ></v-text-field>
            <v-select
              v-model="company.status"
              :items="['Active', 'Inactive']"
              label="Status"
              required
            ></v-select>
            <v-btn type="submit" color="primary">{{
              isEdit ? "Update" : "Create"
            }}</v-btn>
            <v-btn color="grey" @click="closeDialog">Cancel</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-alert v-if="error" type="error" dense>{{ error }}</v-alert>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "ManageCompanies",
  data() {
    return {
      companies: [],
      headers: [
        { text: "ID", value: "id" },
        { text: "Logo", value: "logo" },
        { text: "Name", value: "name" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      dialog: false,
      company: {
        id: null,
        logo: "",
        name: "",
        status: "",
      },
      isEdit: false,
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
        this.error = "Failed to fetch companies.";
      }
    },
    openCreateCompanyDialog() {
      this.isEdit = false;
      this.company = {
        id: null,
        logo: "",
        name: "",
        status: "",
      };
      this.dialog = true;
    },
    editCompany(company) {
      this.isEdit = true;
      this.company = { ...company };
      this.dialog = true;
    },
    async createCompany() {
      try {
        const newCompany = { ...this.company };
        await axios.post("http://localhost:5000/api/companies", newCompany, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        });
        this.dialog = false;
        this.fetchCompanies();
      } catch (error) {
        console.error("Error creating company:", error);
        this.error = "Failed to create company.";
      }
    },
    async updateCompany() {
      try {
        const updatedCompany = { ...this.company };
        await axios.put(
          `http://localhost:5000/api/companies/${this.company.id}`,
          updatedCompany,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        );
        this.dialog = false;
        this.fetchCompanies();
      } catch (error) {
        console.error("Error updating company:", error);
        this.error = "Failed to update company.";
      }
    },
    closeDialog() {
      this.dialog = false;
      this.error = "";
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
