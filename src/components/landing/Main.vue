<script setup>
import { ref } from "vue";
import Navbar from "./Navbar.vue";
import ProjectPage from "./ProjectPage.vue";
import "@wevisdemo/ui/styles/sharer.css";
import WvSharer from "@wevisdemo/ui/vue/sharer";

const languages = ref(["EN", "TH"]);
const activeLang = ref(languages.value[0]);

const selectLang = (lang) => {
  activeLang.value = lang;
};
</script>

<template>
  <div>
    <Navbar
      :languages="languages"
      :activeLang="activeLang"
      :selectLang="selectLang"
    />
    <div
      class="bg-black text-[#FFFC71] min-h-screen flex flex-col text-center justify-center items-center overflow-x-hidden"
    >
      <div
        class="relative w-fit flex flex-col items-center mt-14 md:mt-16 z-10"
      >
        <div class="w-[95%] lg:w-[1000px]">
          <img class="w-full h-full" src="/landing/title.svg" alt="" />
        </div>
      </div>
      <div class="py-8 md:py-[50px] flex flex-col items-center gap-6 md:gap-9">
        <div class="w-[300px] md:w-[550px]">
          <p v-if="activeLang === 'TH'" class="typo-b5">
            ขอต้อนรับสู่ Visualization Playground! <br />
            สถานที่ปล่อยของจากโปรเจกต์ที่นักพัฒนาแห่ง
            <a
              href="https://punchup.world/"
              target="_blank"
              rel="noopener noreferrer"
              class="underline"
              >Punch Up</a
            >
            ได้ทดลองใช้เทคนิค
            <span class="whitespace-nowrap">data visualization</span> แบบต่างๆ
            ผ่านธีมหลักคือภาพยนตร์และแอนิเมชัน เพื่อค้นหา<span
              class="whitespace-nowrap"
              >ความเป็นไปได้ใหม่ๆ</span
            >
            ในการทำงาน <span class="whitespace-nowrap">และบทเรียน</span>จาก<span
              class="whitespace-nowrap"
              >ความสำเร็จ</span
            >และล้มเหลวที่ได้เจอระหว่างทางในงานของตัวเอง
          </p>
          <p v-else class="typo-b5">
            Welcome to our Visualization Playground!<br />
            At
            <a
              href="https://punchup.world/"
              target="_blank"
              rel="noopener noreferrer"
              class="underline"
              >Punch Up</a
            >, we embraced a spirit of experimentation and discovery. Through
            small, 2-3 week projects focused on movies and animations,
            <span class="whitespace-nowrap">our team</span> of technologists
            explored new data visualization techniques, learning from our
            successes and failures along the way.
          </p>
        </div>
        <div class="w-[300px] md:w-[580px]">
          <p v-if="activeLang === 'TH'" class="typo-b5">
            Punch Up เป็นองค์กรที่ขับเคลื่อนด้วย visualization เป็นหลัก
            <span class="whitespace-nowrap"
              >แต่ที่ผ่านมา นักพัฒนามักเป็นด่านท้ายๆ</span
            >
            ของการทำงาน และยังไม่ค่อยได้ใส่ความเห็นเข้ามาตั้งแต่ช่วงคิดค้น
            ออกแบบ และตัดสินใจเลือกเทคนิคของ visualization ในงานมากนัก
            <span class="whitespace-nowrap">โปรเจกต์</span>
            Visualization Playground
            คือการเปิดโอกาสให้นักพัฒนาเหล่านี้ได้เรียนรู้<span
              class="whitespace-nowrap"
              >ว่ามีอะไรที่</span
            >พวกเขาทำได้ เทคนิคอะไรที่มีข้อจำกัด
            ผ่านผลงานที่พวกเขาเลือกหัวข้อค้นคว้า<span class="whitespace-nowrap"
              >ได้อย่างอิสระ</span
            >
            แต่ยังสอดประสานไปกับเป้าหมายขององค์กร
          </p>
          <p v-else class="typo-b5">
            Traditionally, design decisions at Punch Up have been driven by our
            design team. However, we recognize the value of involving our
            developers in the creative process. By allowing them to experiment
            with different visualization techniques, we aim to improve their
            understanding of the technical challenges and opportunities involved
            in data visualization, enabling them to provide more informed
            feedback and contribute to better design solutions.
          </p>
        </div>
      </div>
    </div>
    <ProjectPage :activeLang="activeLang" />
    <div class="bg-black flex justify-center w-full py-11 md:py-16">
      <WvSharer light url="https://visplayground.punchup.world/" />
    </div>
    <div class="bg-black flex justify-center w-full py-6 md:py-10">
      <p class="typo-b5 text-white">
        Copyright {{ new Date().getFullYear() }},
        <a
          href="https://punchup.world/"
          target="_blank"
          rel="noopener noreferrer"
          class="underline"
          >Punch Up</a
        >
      </p>
    </div>
  </div>
</template>

<style scoped></style>
