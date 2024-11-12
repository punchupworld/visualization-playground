<script setup>
import { computed, ref, watch } from "vue";
import { marked } from "marked";

const props = defineProps({
  interviewData: Object,
  dataAnalystInterviewData: Object,
  closeInterviewCard: Function,
});

const questions = ref([
  {
    th: "Position",
    en: "Position",
    id: "position",
  },
  {
    th: "ความถนัด",
    en: "Expertise",
    id: "expertise",
  },
  // {
  //   th: "บทบาท",
  //   en: "What's your role in this project?",
  //   id: "role",
  // },
  {
    th: "แนวคิดของงานนี้คือออะไร",
    en: "What's the concept behind your work?",
    id: "concept",
  },
  {
    th: "เทคโนโลยีที่ใช้ทำงานชิ้นนี้ขึ้นมา",
    en: "What tech did you use creating this work?",
    id: "tech",
  },
  {
    th: "มีกระบวนการทำงานเป็นอย่างไร",
    en: "How's the process?",
    id: "process",
  },
  {
    th: "อุปสรรคที่เจอระหว่างการทำโปรเจกต์",
    en: "Did you find any obstacles during the process?",
    id: "hinder",
  },
  {
    th: "ได้เรียนรู้อะไรจากการทำโปรเจกต์ Visualization Playground บ้าง",
    en: "What did you learn from doing this project?",
    id: "lesson",
  },
  {
    th: "ถ้าให้พูดความรู้สึกโดยรวมกับโปรเจกต์นี้ คิดว่าอยากพูดว่าอะไร",
    en: "How's the overall feeling?",
    id: "feeling",
  },
]);

const showFlukeInterview = ref(false);

const getInterview = computed(() => {
  return showFlukeInterview.value
    ? props.dataAnalystInterviewData
    : props.interviewData;
});

const getConcepts = computed(() => {
  return props.dataAnalystInterviewData["concept_by_project"].split(",");
});

const markdownToHtml = (value) => {
  return marked(value);
};

watch(
  () => showFlukeInterview.value,
  () => {
    scrollToTop();
  },
);

const scrollToTop = () => {
  document.getElementById("interview_card_scrolling_div").scrollTop = 0;
};
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    @click="closeInterviewCard()"
  >
    <div
      id="interview_card_scrolling_div"
      class="relative bg-white w-[95%] md:w-[60%] h-[85%] max-w-[900px] max-h-[750px] overflow-y-auto"
      @click="
        (event) => {
          event.stopPropagation();
        }
      "
    >
      <div
        class="flex flex-col items-center justify-center gap-3 bg-[#FFF8D5] px-12 pt-2 pb-12 sticky top-0 z-30 shadow-md"
      >
        <button
          @click="closeInterviewCard()"
          type="button"
          class="absolute top-3 right-3 z-10 rounded-md inline-flex items-center justify-center text-black"
        >
          <svg
            class="h-8 w-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <a :href="`/${interviewData.path}`">
          <div
            class="top-0 left-0 bg-black text-[#FFFC71] px-2 py-[2px] flex w-fit items-center gap-[6px] cursor-pointer"
          >
            <p class="typo-b4 font-bold leading-none">
              {{ interviewData.title }}
            </p>
            <img
              class="w-4"
              src="/landing/yellow_new_tab.svg"
              alt="New Tab Icon"
            />
          </div>
        </a>

        <div class="relative">
          <div
            :class="`${!showFlukeInterview ? 'opacity-100' : 'opacity-50'} cursor-pointer`"
            @click="showFlukeInterview = false"
          >
            <div
              class="relative z-20 w-[40px] h-[40px] md:w-[60px] md:h-[60px] bg-white border-black border-[1px] rounded-full overflow-hidden"
            >
              <img
                class="w-full h-full object-cover"
                :src="`/${interviewData.devnick_en.toLowerCase()}_profile.webp`"
                alt=""
              />
            </div>
            <div
              :class="`absolute top-1/2 -translate-y-1/2 left-0 -translate-x-full flex flex-col items-end w-max px-2 md:px-4 py-1 border-dashed border-[1px] ${!showFlukeInterview ? 'bg-white rounded-[20px] border-black' : 'border-transparent'}`"
            >
              <div class="flex gap-2">
                <p
                  class="typo-b5 md:typo-b4 font-bold leading-none whitespace-nowrap"
                >
                  {{ interviewData.devnick_th }}
                </p>
                <p class="typo-b5 md:typo-b4 leading-none whitespace-nowrap">
                  {{ interviewData.devname_th }}
                </p>
              </div>
              <p class="typo-b6 leading-none whitespace-nowrap">
                ({{ interviewData.position }})
              </p>
            </div>
          </div>

          <div
            :class="`absolute -right-1/2 top-[60%] ${showFlukeInterview ? 'opacity-100' : 'opacity-50'} cursor-pointer`"
            @click="showFlukeInterview = true"
          >
            <div
              class="w-[40px] h-[40px] md:w-[60px] md:h-[60px] bg-white border-black border-[1px] rounded-full overflow-hidden"
            >
              <img
                class="w-full h-full object-cover"
                :src="`/${dataAnalystInterviewData.devnick_en.toLowerCase()}_profile.webp`"
                alt=""
              />
            </div>
            <div
              :class="`absolute z-10 top-1/2 -translate-y-1/2 right-0 translate-x-full flex flex-col w-max px-2 md:px-4 py-1 border-dashed border-[1px] ${showFlukeInterview ? 'bg-white rounded-[20px] border-black' : 'border-transparent'}`"
            >
              <div class="flex gap-2">
                <p
                  class="typo-b5 md:typo-b4 font-bold leading-none whitespace-nowrap"
                >
                  {{ dataAnalystInterviewData.devnick_th }}
                </p>

                <p class="typo-b5 md:typo-b4 whitespace-nowrap">
                  {{ dataAnalystInterviewData.devname_th }}
                </p>
              </div>

              <p class="typo-b6 whitespace-nowrap">
                ({{ dataAnalystInterviewData.position }})
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="px-2 py-3 md:px-12 md:py-5 flex flex-col gap-3">
        <div v-for="question in questions.slice(1)" :key="question.id">
          <div
            class="bg-[#FFFC71] px-4 py-1 w-fit rounded-[50px] border-[1px] border-dashed border-black"
          >
            <p class="typo-b3 font-bold">
              {{ question.th }}
            </p>
          </div>

          <div class="px-4 py-3 flex flex-col">
            <div
              v-if="question.id === 'concept' && showFlukeInterview"
              class="flex flex-col gap-1"
            >
              <p class="typo-b6 mb-2">
                (เนื่องจากฟลุ๊คทำหน้าที่ Data Analysis
                เลยให้ลองยกตัวอย่างสิ่งที่ต้องทำในแต่ละงาน)
              </p>
              <p
                v-for="concept in getConcepts"
                :key="concept"
                :class="`typo-b4 ${concept.includes(interviewData.title) ? 'bg-[#FFFC71]/50' : 'opacity-50'}`"
                v-html="markdownToHtml(concept)"
              ></p>
            </div>
            <p v-else class="typo-b4">
              {{ getInterview[`${question.id}_th`] }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
