<!-- eslint-disable vue/valid-v-slot -->
<!-- src/views/ManageUsers.vue -->
<template>
  <v-container>
    <h1>Manage Users</h1>
    <v-btn color="green" @click="openCreateUserDialog">Add New User</v-btn>

    <v-data-table :headers="headers" :items="users" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Users</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn color="blue" small @click="editUser(item)">Edit</v-btn>
      </template>
    </v-data-table>

    <!-- Create/Edit User Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{
            isEdit ? "Edit User" : "Create User"
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            @submit.prevent="isEdit ? updateUser() : createUser()"
          >
            <v-text-field
              v-model="user.firstname"
              label="First Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="user.lastname"
              label="Last Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="user.email"
              label="Email"
              required
              type="email"
              :disabled="isEdit"
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="showPassword = !showPassword"
              :disabled="isEdit"
              required
            ></v-text-field>
            <v-select
              v-model="user.type"
              :items="['Writer', 'Editor']"
              label="User Type"
              required
            ></v-select>
            <v-select
              v-model="user.status"
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
import apiClient from "@/plugins/axios";

export default {
  name: "ManageUsers",
  data() {
    return {
      users: [],
      headers: [
        { text: "ID", value: "_id" },
        { text: "First Name", value: "firstname" },
        { text: "Last Name", value: "lastname" },
        { text: "Email", value: "email" },
        { text: "Type", value: "type" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      dialog: false,
      user: {
        _id: null,
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        type: "",
        status: "",
      },
      isEdit: false,
      showPassword: false,
      error: "",
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await apiClient.get("/users");
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        this.error = "Failed to fetch users.";
      }
    },
    openCreateUserDialog() {
      this.isEdit = false;
      this.user = {
        _id: null,
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        type: "",
        status: "",
      };
      this.dialog = true;
    },
    editUser(user) {
      this.isEdit = true;
      this.user = { ...user, password: "" }; // Password not editable
      this.dialog = true;
    },
    async createUser() {
      try {
        const newUser = { ...this.user };
        await apiClient.post("/users", newUser);
        this.dialog = false;
        this.fetchUsers();
      } catch (error) {
        console.error("Error creating user:", error);
        this.error = error.response?.data?.message || "Failed to create user.";
      }
    },
    async updateUser() {
      try {
        const updatedUser = { ...this.user };
        delete updatedUser.password; // Do not send password if not changed
        await apiClient.put(`/users/${this.user._id}`, updatedUser);
        this.dialog = false;
        this.fetchUsers();
      } catch (error) {
        console.error("Error updating user:", error);
        this.error = error.response?.data?.message || "Failed to update user.";
      }
    },
    closeDialog() {
      this.dialog = false;
      this.error = "";
    },
  },
  created() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
