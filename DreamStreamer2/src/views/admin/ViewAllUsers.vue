<template>
  <AdminHomeTest>
    <div
      class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
    >
      <h2 class="text-2xl font-bold text-center mb-6">User Management</h2>

      <!-- Notification Messages -->
      <transition name="fade" mode="out-in">
        <div
          v-if="successMessage"
          class="bg-green-500 text-white p-4 rounded-md mb-4 animate-fade-in-out"
        >
          {{ successMessage }}
        </div>
      </transition>
      <transition name="fade" mode="out-in">
        <div
          v-if="errorMessage"
          class="bg-red-500 text-white p-4 rounded-md mb-4"
        >
          {{ errorMessage }}
        </div>
      </transition>

      <!-- Search Bar -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by username or email..."
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- User Table -->
      <div class="max-w-full overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-200 text-left">
              <th class="min-w-[220px] py-4 px-4 font-medium text-black">
                Username
              </th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black">
                Email
              </th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black">
                Role
              </th>
              <th class="min-w-[100px] py-4 px-4 font-medium text-black">
                Status
              </th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black">
                Created Date
              </th>
              <th class="py-4 px-4 font-medium text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in paginatedUsers"
              :key="user.Username"
              class="bg-white hover:bg-gray-100"
            >
              <td class="py-5 px-4">{{ user.Username }}</td>
              <td class="py-5 px-4">
                {{ getAttribute(user.Attributes, "email") || "N/A" }}
              </td>
              <td class="py-5 px-4">
                {{ getRoleName(getAttribute(user.Attributes, "custom:role")) }}
              </td>
              <td class="py-5 px-4">
                <p
                  class="inline-flex rounded-full py-1 px-3 text-sm font-medium"
                  :class="{
                    'bg-green-100 text-green-500':
                      user.UserStatus === 'CONFIRMED',
                    'bg-red-100 text-red-500': user.UserStatus !== 'CONFIRMED',
                  }"
                >
                  {{ user.UserStatus }}
                </p>
              </td>
              <td class="py-5 px-4">{{ formatDate(user.UserCreateDate) }}</td>
              <td class="py-5 px-4">
                <div class="flex space-x-3">
                  <button
                    @click="openEditModal(user)"
                    class="text-blue-500 hover:text-blue-700"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    @click="toggleDelete(user.Username)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No Users Found -->
      <!-- <div v-else>
          <p class="text-center text-gray-500">No users found.</p>
        </div> -->

      <!-- Pagination Controls -->
      <div class="flex justify-between items-center mt-4">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-300 rounded-md disabled:bg-gray-500"
        >
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-300 rounded-md disabled:bg-gray-500"
        >
          Next
        </button>
      </div>

      <!-- Edit User Modal -->
      <div
        v-if="showEditModal"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h3 class="text-xl font-semibold mb-4">
            Edit User: {{ selectedUser.username }}
          </h3>
          <form @submit.prevent="updateUser">
            <!-- Username (Disabled) -->
            <div class="mb-4">
              <label
                for="edit-username"
                class="block text-gray-700 font-bold mb-2"
                >Username:</label
              >
              <input
                type="text"
                id="edit-username"
                v-model="selectedUser.username"
                disabled
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Email -->
            <div class="mb-4">
              <label for="edit-email" class="block text-gray-700 font-bold mb-2"
                >Email:</label
              >
              <input
                type="email"
                id="edit-email"
                v-model="selectedUser.email"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Role -->
            <div class="mb-4">
              <label for="edit-role" class="block text-gray-700 font-bold mb-2"
                >Role:</label
              >
              <select
                id="edit-role"
                v-model="selectedUser.role"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">User</option>
                <option value="1">Admin</option>
              </select>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end">
              <button
                type="submit"
                class="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
              >
                Save Changes
              </button>
              <button
                type="button"
                @click="closeEditModal"
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminHomeTest>
</template>

<script setup>
import AdminHomeTest from "@/layouts/AdminHomeTest.vue";
import { ref, computed, onMounted } from "vue";

// Reactive state
const users = ref([]);
const showEditModal = ref(false);
const selectedUser = ref({
  username: "",
  email: "",
  role: "0", // Default to User role
});
const successMessage = ref(null);
const errorMessage = ref(null);
const searchQuery = ref("");

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 10;

// Function to get attribute by name
const getAttribute = (attributes, attributeName) => {
  const attribute = attributes.find((attr) => attr.Name === attributeName);
  return attribute ? attribute.Value : null;
};

// Function to map role
const getRoleName = (roleValue) => {
  if (roleValue === "0") return "User";
  if (roleValue === "1") return "Admin";
  return "Unknown";
};

// Function to format date
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleString();
};

// Fetch users from the API
const fetchUsers = async () => {
  try {
    const response = await fetch(
      "https://6vq0xwus5b.execute-api.ap-southeast-1.amazonaws.com/dev/viewAllUsers"
    );
    const data = await response.json();

    if (Array.isArray(data)) {
      users.value = data;
    } else {
      users.value = JSON.parse(data.body);
    }
  } catch (error) {
    errorMessage.value = "Error fetching users.";
    console.error("Error fetching users:", error);
  }
};

// Open the edit user modal and populate selected user details
const openEditModal = (user) => {
  selectedUser.value = {
    username: user.Username,
    email: getAttribute(user.Attributes, "email"),
    role: getAttribute(user.Attributes, "custom:role"),
  };
  showEditModal.value = true;
};

// Close the edit user modal
const closeEditModal = () => {
  showEditModal.value = false;
};

// Update user by calling the backend Lambda function
const updateUser = async () => {
  try {
    const requestBody = {
      username: selectedUser.value.username,
      email: selectedUser.value.email,
      role: selectedUser.value.role, // Use "role" here, not inside attributes
    };

    const response = await fetch(
      "https://6vq0xwus5b.execute-api.ap-southeast-1.amazonaws.com/dev/updateUser",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Failed to update user: " + errorText);
    }

    const result = await response.json();
    console.log("User updated successfully:", result);
    successMessage.value = "User updated successfully!";
    closeEditModal();
    fetchUsers(); // Refresh the user list after update

    // Hide success message after 3 seconds
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } catch (error) {
    errorMessage.value = error.message || "Error updating user.";
    console.error("Error updating user:", error);
  }
};

// Delete user by passing the username in the body
const toggleDelete = async (username) => {
  if (!confirm(`Are you sure you want to delete user "${username}"?`)) return;

  try {
    const requestBody = { username };

    const response = await fetch(
      "https://6vq0xwus5b.execute-api.ap-southeast-1.amazonaws.com/dev/deleteUser",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Failed to delete user: " + errorText);
    }

    const result = await response.json();
    console.log("User deleted successfully:", result);
    successMessage.value = "User deleted successfully!";
    fetchUsers(); // Refresh the user list after deletion

    // Hide success message after 3 seconds
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } catch (error) {
    errorMessage.value = error.message || "Error deleting user.";
    console.error("Error deleting user:", error);
  }
};

// Computed properties for search and pagination
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;

  return users.value.filter((user) => {
    const email = getAttribute(user.Attributes, "email") || "";
    return (
      user.Username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredUsers.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / itemsPerPage)
);

// Pagination controls
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
};

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1;
};

// Fetch users on component mount
onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
/* Container Styling */
.rounded-sm {
  border-radius: 0.125rem;
}
.border {
  border-width: 1px;
}
.border-stroke {
  border-color: #e5e7eb; /* Light gray */
}
.bg-white {
  background-color: #ffffff;
}
.px-5 {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
.pt-6 {
  padding-top: 1.5rem;
}
.pb-2.5 {
  padding-bottom: 0.625rem;
}
.shadow-default {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.dark:border-strokedark {
  border-color: #374151; /* Dark gray */
}
.dark:bg-boxdark {
  background-color: #1f2937; /* Dark background */
}
.sm:px-7.5 {
  padding-left: 1.875rem;
  padding-right: 1.875rem;
}
.xl:pb-1 {
  padding-bottom: 0.25rem;
}

/* Title Styling */
.title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937; /* Dark text */
}

/* Table Styling */
.table-auto {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 1rem;
  text-align: left;
}
th {
  background-color: #f3f4f6; /* Light gray */
  color: #1f2937; /* Dark text */
  font-weight: 600;
}
tr:hover {
  background-color: #f9fafb; /* Slightly lighter gray on hover */
}
.bg-gray-200 {
  background-color: #e5e7eb;
}
.bg-gray-100 {
  background-color: #f3f4f6;
}
.text-black {
  color: #000000;
}

/* Status Styling */
.bg-green-100 {
  background-color: #d1fae5;
}
.text-green-500 {
  color: #10b981;
}
.bg-red-100 {
  background-color: #fee2e2;
}
.text-red-500 {
  color: #ef4444;
}
.inline-flex {
  display: inline-flex;
}
.rounded-full {
  border-radius: 9999px;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.text-sm {
  font-size: 0.875rem;
}
.font-medium {
  font-weight: 500;
}

/* Action Buttons Styling */
.text-blue-500 {
  color: #3b82f6;
}
.hover\:text-blue-700:hover {
  color: #1d4ed8;
}
.text-red-500 {
  color: #ef4444;
}
.hover\:text-red-700:hover {
  color: #b91c1c;
}

/* Pagination Styling */
.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.mt-4 {
  margin-top: 1rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.bg-gray-300 {
  background-color: #d1d5db;
}
.rounded-md {
  border-radius: 0.375rem;
}
.disabled\:bg-gray-500:disabled {
  background-color: #6b7280;
  cursor: not-allowed;
}

/* Modal Styling */
.fixed {
  position: fixed;
}
.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.bg-gray-500 {
  background-color: rgba(107, 114, 128, 0.75);
}
.bg-opacity-75 {
  background-opacity: 0.75;
}
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.z-50 {
  z-index: 50;
}
.bg-white {
  background-color: #ffffff;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
.p-6 {
  padding: 1.5rem;
}
.w-full {
  width: 100%;
}
.max-w-md {
  max-width: 28rem;
}

/* Form Inputs Styling */
.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Button Styling */
button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}
.bg-green-700 {
  background-color: #047857;
}
.hover\:bg-green-800:hover {
  background-color: #065f46;
}
.text-white {
  color: #ffffff;
}
.font-bold {
  font-weight: 700;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.rounded {
  border-radius: 0.375rem;
}
.bg-gray-500 {
  background-color: #6b7280;
}
.hover\:bg-gray-700:hover {
  background-color: #4b5563;
}

/* Fade animation */
@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.animate-fade-in-out {
  animation: fadeInOut 3s ease-in-out;
}
</style>
