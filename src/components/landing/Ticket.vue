<script setup>
import { ref } from "vue";
import InterviewCard from "./InterviewCard.vue";

const props = defineProps({
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
      :interviewData="data"
      :dataAnalystInterviewData="dataAnalystInterviewData"
      :closeInterviewCard="closeInterviewCard"
    />

    <div class="relative flex w-[1100px] bg-black">
      <div
        class="absolute z-10 top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full w-[80px] h-[80px] flex-none bg-black"
      />
      <div
        class="absolute z-10 bottom-0 left-0 -translate-x-1/2 translate-y-1/2 rounded-full w-[80px] h-[80px] flex-none bg-black"
      />

      <div
        class="absolute top-0 left-0 -translate-x-1/2 z-20 flex flex-col justify-between h-full py-[60px]"
      >
        <div v-for="i in 10" :key="i">
          <div class="rounded-full w-[35px] h-[35px] flex-none bg-black" />
        </div>
      </div>

      <div
        :class="`relative w-[75%] py-[30px] px-[80px] transition-all duration-300 ${ticketNoOnHover === data.ID ? 'bg-[#FFFC71]' : 'bg-[#FFF8D5]'}`"
      >
        <div
          class="absolute z-10 top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full w-[80px] h-[80px] flex-none bg-black"
        />
        <div
          class="absolute z-10 bottom-0 left-0 -translate-x-1/2 translate-y-1/2 rounded-full w-[80px] h-[80px] flex-none bg-black"
        />
        <div
          class="absolute z-20 top-0 right-0 w-[10px] h-full border-r-[2px] border-dashed border-black"
        ></div>

        <div
          class="absolute z-10 top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full w-[80px] h-[80px] flex-none bg-black"
        />
        <div
          class="absolute z-10 bottom-0 right-0 translate-x-1/2 translate-y-1/2 rounded-full w-[80px] h-[80px] flex-none bg-black"
        />
        <div class="w-full max-w-[650px]">
          <img
            class="w-full h-full object-cover"
            :src="`/${data.devnick_en.toLowerCase()}.webp`"
            alt=""
          />
          <div
            :class="`transition-all duration-300 ${ticketNoOnHover === data.ID ? 'bg-[#FFF8D5]' : 'bg-[#FFFC71] '} border-dashed border-t-[1px] border-b-[1px] border-black/50 absolute z-10 w-full left-0 right-0 h-[55px]`"
          >
            <!-- <div
              class="bg-[#FFFC71] border-dashed border-t-[1px] border-b-[1px] border-black/50 absolute top-1/2 -translate-y-1/2 right-0 translate-x-full w-full h-[55px]"
            ></div> -->
          </div>
        </div>
        <div
          class="cursor-pointer relative z-20 py-[6px] flex items-center gap-3"
          @click="goToProject(data.path)"
          @mouseover="hoverTicket(data)"
          @mouseout="unHoverTicket()"
        >
          <p class="typo-h5 font-bold leading-none">
            {{ data.title }}
          </p>
          <img class="w-8" src="/landing/new_tab.svg" alt="New Tab Icon" />
        </div>
        <p class="typo-b3 pt-2 h-[170px]">
          {{ data.desc_en }}
        </p>
      </div>
      <div
        :class="`relative w-[25%] bg-white px-5 overflow-hidden pt-[50px] pb-[65px] flex flex-col justify-between ${selectedProject === data.path && 'ticket-tearing'} z-10`"
      >
        <div
          class="absolute z-10 top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full w-[80px] h-[80px] flex-none bg-black"
        />
        <div
          class="absolute z-10 bottom-0 left-0 -translate-x-1/2 translate-y-1/2 rounded-full w-[80px] h-[80px] flex-none bg-black"
        />

        <div
          class="absolute z-10 top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full w-[80px] h-[80px] flex-none bg-black"
        />
        <div
          class="absolute z-10 bottom-0 right-0 translate-x-1/2 translate-y-1/2 rounded-full w-[80px] h-[80px] flex-none bg-black"
        />

        <div
          class="absolute top-0 right-0 translate-x-1/2 z-20 flex flex-col justify-between h-full py-[60px]"
        >
          <div v-for="i in 10" :key="i">
            <div class="rounded-full w-[35px] h-[35px] flex-none bg-black" />
          </div>
        </div>

        <div>
          <div
            class="relative w-[100px] h-[100px] bg-white border-black border-[1px] rounded-full overflow-hidden"
          >
            <img
              class="w-full h-full object-cover"
              :src="`/${data.devnick_en.toLowerCase()}_profile.webp`"
              alt=""
            />
            <div
              class="star absolute top-0 right-0 translate-x-[70%] -translate-y-[70%]"
            ></div>
          </div>
          <div class="pt-3">
            <p class="typo-b3 font-bold leading-none">{{ data.devnick_en }}</p>
            <p class="typo-b6">{{ data.devname_en }}</p>
          </div>
          <button
            @click="openInterviewCard"
            class="flex items-center gap-2 mt-4 bg-[#FFF8D5] hover:bg-[#FFFC71] rounded-[20px] px-4 py-2 border-[1px] border-black"
          >
            <img class="w-5" src="/landing/microphone.svg" alt="Microphone" />
            Interview
          </button>
        </div>
        <div class="">
          <p
            v-for="hashtag in data.hashtags"
            :key="hashtag"
            class="typo-b2 font-bold"
          >
            {{ hashtag }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.star {
  width: 35px;
  aspect-ratio: 1;
  background: black;
  clip-path: polygon(
    50% 0,
    calc(50% * (1 + sin(0.4turn))) calc(50% * (1 - cos(0.4turn))),
    calc(50% * (1 - sin(0.2turn))) calc(50% * (1 - cos(0.2turn))),
    calc(50% * (1 + sin(0.2turn))) calc(50% * (1 - cos(0.2turn))),
    calc(50% * (1 - sin(0.4turn))) calc(50% * (1 - cos(0.4turn)))
  );
}

.ticket-tearing {
  animation: tearoff 1.5s forwards;
  transform-origin: 0 100%;
}

@keyframes tearoff {
  50% {
    right: 0;
  }
  60% {
    transform: rotate(5deg);
  }
  75% {
    right: -25px;
  }
  100% {
    transform: rotate(5deg);
    right: -25px;
  }
}
</style>
