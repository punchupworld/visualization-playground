<script setup>
import { ref } from "vue";
import InterviewCard from "./InterviewCard.vue";

const props = defineProps({
  activeLang: String,
  data: Object,
  dataAnalystInterviewData: Object,
  selectedProject: String,
  goToProject: Function,
});

const ticketNoOnHover = ref("");
const interviewCardNo = ref("");

const hoverTicket = (data) => {
  ticketNoOnHover.value = data.ID;
};
const unHoverTicket = () => {
  ticketNoOnHover.value = "";
};

const openInterviewCard = () => {
  interviewCardNo.value = props.data.ID;
};
const closeInterviewCard = () => {
  interviewCardNo.value = "";
};
</script>

<template>
  <div class="bg-black transition-all duration-300">
    <InterviewCard
      v-if="interviewCardNo !== ''"
      :activeLangMain="activeLang"
      :interviewData="data"
      :dataAnalystInterviewData="dataAnalystInterviewData"
      :closeInterviewCard="closeInterviewCard"
      :showLanguageButton="false"
    />

    <div
      class="relative flex flex-col items-center md:items-stretch md:flex-row lg:w-[1100px] bg-black py-10 md:py-0"
    >
      <div
        class="hidden md:flex absolute top-0 left-0 -translate-x-1/2 z-20 flex-col justify-between h-full py-[60px]"
      >
        <div v-for="i in 10" :key="i">
          <div
            class="rounded-full w-[15px] h-[15px] lg:w-[35px] lg:h-[35px] flex-none bg-black"
          />
        </div>
      </div>

      <div
        @click="goToProject(data.path)"
        @mouseover="hoverTicket(data)"
        @mouseout="unHoverTicket()"
        :class="`cursor-pointer overflow-hidden relative w-[90%] py-3 px-8 md:w-[75%] md:py-5 md:px-10 lg:py-[30px] lg:px-[80px] transition-all duration-300 ${ticketNoOnHover === data.ID ? 'bg-[#FFFC71]' : 'bg-[#FFF8D5]'}`"
      >
        <div
          class="absolute z-10 top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full w-[40px] h-[40px] lg:w-[80px] lg:h-[80px] flex-none bg-black"
        />
        <div
          class="absolute z-10 bottom-0 left-0 -translate-x-1/2 translate-y-1/2 rounded-full w-[40px] h-[40px] lg:w-[80px] lg:h-[80px] flex-none bg-black"
        />
        <div
          class="hidden md:block absolute z-20 top-0 right-0 w-[10px] h-full md:border-r-[2px] border-dashed border-black"
        ></div>
        <div
          class="block md:hidden absolute z-20 bottom-0 left-0 w-full border-b-[1px] border-dashed border-black"
        ></div>

        <div
          class="absolute z-10 top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full w-[40px] h-[40px] lg:w-[80px] lg:h-[80px] flex-none bg-black"
        />
        <div
          class="absolute z-10 bottom-0 right-0 translate-x-1/2 translate-y-1/2 rounded-full w-[40px] h-[40px] lg:w-[80px] lg:h-[80px] flex-none bg-black"
        />
        <div>
          <div class="w-full max-w-[650px]">
            <img
              class="w-full h-full object-cover border-black border-b-0 border-dashed border-[1px] mt-2"
              :src="`/${data.devnick_en.toLowerCase()}.webp`"
              alt=""
            />
            <div
              :class="`hidden md:block transition-all duration-300 ${ticketNoOnHover === data.ID ? 'bg-[#FFF8D5]' : 'bg-[#FFFC71]'} border-dashed border-t-[1px] border-b-[1px] border-black/50 absolute z-10 w-full left-0 right-0 h-[55px]`"
            >
              <!-- <div
              class="bg-[#FFFC71] border-dashed border-t-[1px] border-b-[1px] border-black/50 absolute top-1/2 -translate-y-1/2 right-0 translate-x-full w-full h-[55px]"
            ></div> -->
            </div>
          </div>
          <div class="relative z-20 py-[6px] flex items-center gap-3">
            <p
              class="typo-h6 translate-y-[1px] md:typo-h5 font-bold leading-none"
            >
              {{ data.title }}
            </p>
            <img
              class="w-6 md:w-8"
              src="/landing/new_tab.svg"
              alt="New Tab Icon"
            />
          </div>
          <p class="typo-b4 md:pt-3 h-fit lg:h-[170px]">
            {{ data[`desc_${activeLang}`] }}
          </p>
        </div>
      </div>
      <div
        :class="`relative w-[90%] md:w-[25%] bg-white px-8 md:pl-8 md:pr-14 overflow-hidden py-4 md:py-3 lg:pt-[50px] lg:pb-[65px] flex flex-col justify-between ${selectedProject === data.path && 'ticket-tearing'} z-10`"
      >
        <div
          class="md:w-full h-full md:h-fit flex flex-col md:flex-row absolute top-1/2 md:top-5 -translate-y-1/2 md:-translate-x-1/2 left-0 md:left-1/2 justify-around md:px-11 py-7 md:py-0"
        >
          <div
            v-for="i in 5"
            :key="i"
            class="star-shape w-[25px] scale-50 md:scale-[unset] bg-black"
          ></div>
        </div>
        <div
          class="md:w-full h-full md:h-fit flex flex-col md:flex-row absolute bottom-1/2 md:bottom-5 translate-y-1/2 md:-translate-x-1/2 right-0 md:right-[unset] md:left-1/2 justify-around md:px-11 py-7 md:py-0"
        >
          <div
            v-for="i in 5"
            :key="i"
            class="star-shape w-[25px] scale-50 md:scale-[unset] bg-black"
          ></div>
        </div>
        <div
          class="absolute z-10 top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full w-[40px] h-[40px] lg:w-[80px] lg:h-[80px] flex-none bg-black"
        />
        <div
          class="absolute z-10 bottom-0 left-0 -translate-x-1/2 translate-y-1/2 rounded-full w-[40px] h-[40px] lg:w-[80px] lg:h-[80px] flex-none bg-black"
        />

        <div
          class="absolute z-10 top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full w-[40px] h-[40px] lg:w-[80px] lg:h-[80px] flex-none bg-black"
        />
        <div
          class="absolute z-10 bottom-0 right-0 translate-x-1/2 translate-y-1/2 rounded-full w-[40px] h-[40px] lg:w-[80px] lg:h-[80px] flex-none bg-black"
        />

        <div
          class="hidden md:flex absolute top-0 right-0 translate-x-1/2 z-20 flex-col justify-between h-full py-[60px]"
        >
          <div v-for="i in 10" :key="i">
            <div
              class="rounded-full w-[15px] h-[15px] lg:w-[35px] lg:h-[35px] flex-none bg-black"
            />
          </div>
        </div>

        <div>
          <div
            class="flex md:flex-col items-center md:items-start gap-4 md:gap-0"
          >
            <div class="relative w-fit">
              <div
                class="w-[60px] h-[60px] lg:w-[100px] lg:h-[100px] bg-white border-black border-[1px] rounded-full overflow-hidden"
              >
                <img
                  class="w-full h-full object-cover"
                  :src="`/${data.devnick_en.toLowerCase()}_profile.webp`"
                  alt=""
                />
              </div>
            </div>
            <div>
              <div class="pt-1 md:pt-3">
                <p class="typo-b3 font-bold leading-none">
                  {{ data[`devnick_${activeLang}`] }}
                </p>
                <p class="typo-b6">{{ data[`devname_${activeLang}`] }}</p>
              </div>
            </div>
          </div>
          <button
            @click="openInterviewCard"
            class="flex items-center gap-2 my-3 md:mt-4 md:mb-0 bg-[#FFF8D5] hover:bg-[#FFFC71] rounded-[20px] px-3 md:px-4 py-[5px] md:py-2 border-[1px] border-black"
          >
            <img
              class="w-4 md:w-5"
              src="/landing/microphone.svg"
              alt="Microphone"
            />
            {{ activeLang === "th" ? "บทสัมภาษณ์" : "Interview" }}
          </button>
        </div>
        <div
          class="w-fit flex gap-2 md:flex-col md:gap-0 border-black border-dashed border-[1px] px-3 md:px-5 py-1 md:py-2 flex-wrap mt-2 md:mt-0"
        >
          <p
            v-for="hashtag in data.hashtags"
            :key="hashtag"
            class="typo-b5 md:typo-b2 font-bold"
          >
            {{ hashtag }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ticket-tearing {
  animation: tearoff 1.5s forwards;
  transform-origin: 0 100%;
  @media only screen and (max-width: 600px) {
    animation: tearoff-mb 1.5s forwards;
    transform-origin: 0 0;
  }
}

@keyframes tearoff {
  50% {
    right: 0;
  }
  60% {
    transform: rotate(5deg);
  }
  75% {
    right: -20px;
  }
  100% {
    transform: rotate(5deg);
    right: -20px;
  }
}

@keyframes tearoff-mb {
  50% {
    bottom: 0;
  }
  60% {
    transform: rotate(3deg);
  }
  75% {
    bottom: -10px;
  }
  100% {
    transform: rotate(3deg);
    bottom: -10px;
  }
}
</style>
