<script setup>
import { ref, onMounted } from "vue";
import * as d3 from "d3";
import Ticket from "./Ticket.vue";

defineProps({
  activeLang: String,
});

const projects = ref();
const dataAnalystInterviewData = ref();
const selectedProject = ref("");

onMounted(async () => {
  const rawProjects = await d3.csv("/projects.csv");
  dataAnalystInterviewData.value = rawProjects[0];

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
        <div
          class="relative min-h-screen flex justify-center items-center overflow-x-hidden"
        >
          <Ticket
            :activeLang="activeLang.toLowerCase()"
            :data="project"
            :dataAnalystInterviewData="dataAnalystInterviewData"
            :selectedProject="selectedProject"
            :goToProject="goToProject"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
