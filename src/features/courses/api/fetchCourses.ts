import { SEED_COURSES, type Course } from '../data/seedCourses';

const FAKE_LATENCY_MS = 1000;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

/** Simulated network fetch — swap implementation when a real courses API exists. */
export async function fetchCourses(): Promise<readonly Course[]> {
  await delay(FAKE_LATENCY_MS);
  return SEED_COURSES;
}
