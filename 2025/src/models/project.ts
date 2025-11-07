import {
  asString,
  Column,
  Object as Obj,
  type StaticDecode,
} from "sheethuahua";

export const projectSchema = Obj({
  creatorName: Column("Name", asString()),
  creatorPosition: Column("Position", asString()),
  projectName: Column("Project Name", asString()),
  outputType: Column("Output Type", asString()),
  description: Column("Project Description", asString()),
  projectUrl: Column("URL", asString()),
  q1: Column("ทำไมเลือกทำเรื่องนี้", asString()),
  q2: Column(
    "อะไรในงานนี้ที่ตัวเองไม่เคยทำมาก่อนในชีวิตการทำงานปกติ",
    asString(),
  ),
  q3: Column("ได้ลองแล้วรู้สึกยังไง", asString()),
});

export type Project = StaticDecode<typeof projectSchema>;
