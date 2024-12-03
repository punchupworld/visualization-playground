<script setup>
import { onMounted, computed, ref, watch } from "vue";
import { marked } from "marked";

const props = defineProps({
  activeLangMain: String,
  interviewData: Object,
  dataAnalystInterviewData: Object,
  closeInterviewCard: Function,
  showLanguageButton: Boolean,
});

onMounted(() => {
  activeLang.value = props.activeLangMain;
});

const activeLang = ref("");

const selectLang = (lang) => {
  activeLang.value = lang;
};

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
const showClickIcon = ref(true);

const getInterview = computed(() => {
  return showFlukeInterview.value
    ? props.dataAnalystInterviewData
    : props.interviewData;
});

const getConcepts = computed(() => {
  return props.dataAnalystInterviewData[
    `concept_by_project_${activeLang.value}`
  ].split("/");
});

const markdownToHtml = (value) => {
  return marked(value);
};

watch(
  () => [showFlukeInterview.value, activeLang.value],
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
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 text-black"
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
        :class="`flex flex-col items-center justify-center gap-3 bg-[#FFF8D5] px-8 md:px-12 ${showLanguageButton ? 'pt-8' : 'pt-3'} md:pt-3 pb-12 sticky top-0 z-30 shadow-md`"
      >
        <div
          v-if="showLanguageButton"
          class="absolute top-1 md:top-[6px] left-2 md:left-[10px] flex items-center gap-2"
        >
          <button
            :class="`${activeLang === 'en' ? 'font-bold' : 'opacity-50'} py-[2px] rounded-[20px] cursor-pointer`"
            @click="selectLang('en')"
          >
            <p class="typo-b5 md:typo-b4 translate-y-[1px]">EN</p>
          </button>
          <div>/</div>
          <button
            :class="`${activeLang === 'th' ? 'font-bold' : 'opacity-50'} py-[2px] rounded-[20px] cursor-pointer`"
            @click="selectLang('th')"
          >
            <p class="typo-b5 md:typo-b4 translate-y-[1px]">TH</p>
          </button>
        </div>
        <button
          @click="closeInterviewCard()"
          type="button"
          class="absolute top-[6px] right-2 md:top-2 z-10 rounded-md inline-flex items-center justify-center text-black"
        >
          <svg
            class="h-6 w-6 md:h-8 md:w-8"
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

        <a
          :href="`/${interviewData.path}`"
          :class="`${showLanguageButton && 'pointer-events-none'}`"
        >
          <div
            class="top-0 left-0 bg-black text-[#FFFC71] px-2 py-[2px] flex w-fit items-center gap-[6px] cursor-pointer"
          >
            <p class="typo-b4 font-bold leading-none">
              {{ interviewData.title }}
            </p>
            <img
              v-if="!showLanguageButton"
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
              :class="`w-max max-w-[150px] md:max-w-[unset] text-right absolute -top-2 md:top-1/2 md:-translate-y-1/2 left-0 -translate-x-full flex flex-col items-end px-[10px] md:px-4 py-1 border-dashed border-[1px] ${!showFlukeInterview ? 'bg-white rounded-[12px] md:rounded-[20px] border-black' : 'border-transparent'}`"
            >
              <div class="flex flex-col md:flex-row md:gap-2">
                <p
                  class="typo-b5 md:typo-b4 font-bold leading-none whitespace-nowrap"
                >
                  {{ interviewData[`devnick_${activeLang}`] }}
                </p>
                <p class="typo-b5 md:typo-b4 leading-none md:whitespace-nowrap">
                  {{ interviewData[`devname_${activeLang}`] }}
                </p>
              </div>
              <p class="typo-b6 leading-none whitespace-nowrap">
                ({{ interviewData.position }})
              </p>
            </div>
          </div>

          <div
            :class="`absolute -right-1/2 top-[60%] ${showFlukeInterview ? 'opacity-100' : 'opacity-50'} cursor-pointer`"
            @click="
              () => {
                showClickIcon = false;
                showFlukeInterview = true;
              }
            "
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
              :class="`w-max max-w-[150px] md:max-w-[unset] absolute z-10 top-1/2 -translate-y-1/2 right-0 translate-x-full flex flex-col px-[10px] md:px-4 py-1 border-dashed border-[1px] ${showFlukeInterview ? 'bg-white rounded-[15px] md:rounded-[20px] border-black' : 'border-transparent'}`"
            >
              <div v-if="showClickIcon" class="absolute bottom-0 -right-1">
                <img
                  class="w-4 md:w-5 rotate-[-30deg]"
                  src="/landing/hand.svg"
                  alt=""
                />
              </div>
              <div class="flex flex-col md:flex-row md:gap-2">
                <p
                  class="typo-b5 md:typo-b4 font-bold leading-none whitespace-nowrap"
                >
                  {{ dataAnalystInterviewData[`devnick_${activeLang}`] }}
                </p>

                <p class="typo-b5 md:typo-b4 md:whitespace-nowrap">
                  {{ dataAnalystInterviewData[`devname_${activeLang}`] }}
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
            <p class="typo-b4 font-bold">
              {{ question[activeLang] }}
            </p>
          </div>

          <div class="px-3 py-2 md:px-4 md:py-3 flex flex-col">
            <div
              v-if="question.id === 'concept' && showFlukeInterview"
              class="flex flex-col gap-1"
            >
              <p class="typo-b6 mb-2">
                {{
                  activeLang === "th"
                    ? "(เนื่องจากฟลุ๊คทำหน้าที่ Data Analysis เลยให้ลองยกตัวอย่างสิ่งที่ต้องทำในแต่ละงาน)"
                    : "(Since Fluke is a Data Analyst, I asked him to give examples of what he does in each project.)"
                }}
              </p>
              <p
                v-for="concept in getConcepts"
                :key="concept"
                :class="`typo-b4 ${concept.includes(interviewData.title) ? 'bg-[#FFFC71]/50' : 'opacity-50'}`"
                v-html="markdownToHtml(concept)"
              ></p>
            </div>
            <p v-else class="typo-b4">
              {{ getInterview[`${question.id}_${activeLang}`] }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
