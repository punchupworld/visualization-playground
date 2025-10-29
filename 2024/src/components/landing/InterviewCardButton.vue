<script setup>
import { ref, onMounted, computed } from "vue";
import * as d3 from "d3";
import InterviewCard from "./InterviewCard.vue";

const props = defineProps({
  id: String,
  base: String,
});

const interviewCardNo = ref("");

const projects = ref();
const dataAnalystInterviewData = ref();

onMounted(async () => {
  const rawProjects = await d3.csv("/2024/projects.csv");
  dataAnalystInterviewData.value = rawProjects[0];

  projects.value = rawProjects.slice(1).map((p) => {
    p.hashtags = p.hashtag.split(" ");
    return p;
  });
});

const getData = computed(() => {
  return projects.value.find((p) => p.ID === props.id);
});

const openInterviewCard = () => {
  interviewCardNo.value = props.id;
};
const closeInterviewCard = () => {
  interviewCardNo.value = "";
};
</script>

<template>
  <div>
    <div
      @click="openInterviewCard()"
      class="fixed bottom-1 right-1 md:bottom-2 md:right-2 z-50 bg-white border-black border-[1px] shadow-xl hover:bg-[#FFFC71] p-2 md:p-3 rounded-full flex justify-center items-center cursor-pointer"
    >
      <img
        class="w-[15px] md:w-5"
        src="/2024/landing/microphone.svg"
        alt="Microphone"
      />
    </div>
    <InterviewCard
      v-if="interviewCardNo !== ''"
      :activeLangMain="'en'"
      :interviewData="getData"
      :dataAnalystInterviewData="dataAnalystInterviewData"
      :closeInterviewCard="closeInterviewCard"
      :showLanguageButton="true"
    />
  </div>
</template>
