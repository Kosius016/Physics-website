import type { Lesson } from "@/lib/types";
import { lessonKinematikaDvizheniePodAgal } from "./kinematika-dvizhenie-pod-agal";

/** Регистър на всички уроци. Нов урок = нов файл + ред тук. */
const lessons: Lesson[] = [lessonKinematikaDvizheniePodAgal];

export function getAllLessons(): Lesson[] {
  if (process.env.NODE_ENV !== "production") return lessons;
  return lessons.filter(
    (lesson) =>
      !(
        lesson.topicSlug === "kinematika" &&
        lesson.slug === "dvizhenie-pod-agal"
      ),
  );
}

export function getLesson(topicSlug: string, slug: string): Lesson | undefined {
  return getAllLessons().find((l) => l.topicSlug === topicSlug && l.slug === slug);
}
