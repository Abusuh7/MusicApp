<template>
    <div class="stat-card">
      <i :class="icon"></i>
      <div class="stat-info">
        <strong>{{ title }}</strong>
        <p>{{ value }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    icon: String,
    title: String,
    value: [String, Number],
  });
  </script>
  
  <style scoped>
  .stat-card {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s ease;
  }
  
  .stat-card:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
  
  .stat-card i {
    font-size: 2rem;
    margin-right: 15px;
    color: #4A5568;
  }
  
  .stat-info strong {
    font-size: 1.2rem;
    color: #2d3748;
  }
  
  .stat-info p {
    font-size: 1.5rem;
    color: #1a202c;
    margin: 0;
  }
  </style>
  