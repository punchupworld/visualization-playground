<script setup>
import { ref, onMounted } from "vue";
import * as d3 from "d3";
import Ticket from "./Ticket.vue";

const projects = ref();
const selectedProject = ref("");
onMounted(async () => {
  const rawProjects = await d3.csv("/projects.csv");
  projects.value = rawProjects.slice(1).map((p) => {
    p.hashtags = p.hashtag.split(" ");
    return p;
  });
});

const goToProject = (path) => {
  selectedProject.value = path;
  setTimeout(() => {
    window.location.href = `/${path}`;
  }, 1500);
};
</script>

<template>
  <div>
    <div v-for="project in projects" :key="project.id">
      <div class="bg-black">
        <div class="min-h-screen flex justify-center items-center">
          <Ticket
            :data="project"
            :selectedProject="selectedProject"
            :goToProject="goToProject"
          />
        </div>
      </div>
    </div>
  </div>
</template>
