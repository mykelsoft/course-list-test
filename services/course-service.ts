// services/course-service.ts

import { MOCK_COURSES } from '@/lib/mock-data';
import type { CourseWithDetails } from '@/types/courses';

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for the session
let _courses = [...MOCK_COURSES];

export const courseService = {
  async fetchCourses({ isPaid = false, archived = false }: { isPaid?: boolean, archived?: boolean } = {}): Promise<CourseWithDetails[]> {
    await delay(600);
    
    // Simple filter simulation
    return _courses.filter(c => {
      // Filter by paid status if specified (undefined usually means fetch all in some contexts, 
      // but strictly following the mock data which is all is_paid: false for now)
      if (isPaid !== undefined && c.is_paid !== isPaid) return false;
      
      // Filter by archived status
      if (archived) {
        return c.deletedAt !== null && c.deletedAt !== undefined;
      } else {
        return c.deletedAt === null || c.deletedAt === undefined;
      }
    });
  },

  async fetchCompanies() {
    await delay(300);
    return [
      { id: 1, name: 'ISO Safety' },
      { id: 2, name: 'ASHR Construction' },
      { id: 3, name: 'Mond Corp.' },
      { id: 4, name: 'Safety Culture' },
      { id: 5, name: 'Acme Brick' },
    ];
  },

  async fetchJobRoles() {
    await delay(300);
    return [
      { id: 1, name: 'Safety Officer' },
      { id: 2, name: 'Site Manager' },
      { id: 3, name: 'Forklift Operator' },
      { id: 4, name: 'General Laborer' },
    ];
  },

  async fetchLinkedJobRoles(courseId: number) {
    await delay(400);
    // Return random subset for demo purposes
    if (courseId % 2 === 0) {
      return [{ id: 1, name: 'Safety Officer' }, { id: 2, name: 'Site Manager' }];
    }
    return [];
  },

  async deleteCourse(id: number) {
    await delay(500);
    _courses = _courses.filter(c => c.id !== id);
    return { success: true };
  },

  async archiveCourses(ids: number[]) {
    await delay(500);
    _courses = _courses.map(c => {
      if (ids.includes(c.id)) {
        return { ...c, deletedAt: new Date() };
      }
      return c;
    });
    return { success: true };
  },

  async restoreCourses(ids: number[]) {
      await delay(500);
      _courses = _courses.map(c => {
        if (ids.includes(c.id)) {
          return { ...c, deletedAt: null };
        }
        return c;
      });
      return { success: true };
  },

  async duplicateCourse(id: number) {
    await delay(800);
    const original = _courses.find(c => c.id === id);
    if (original) {
      const newCourse = {
        ...original,
        id: Math.max(..._courses.map(c => c.id)) + 1,
        name: `Copy of ${original.name}`,
        updatedAt: new Date(),
      };
      _courses.push(newCourse);
    }
    return { success: true };
  },

  async removeCourseFromJobRole(courseId: number, jobRoleId: number) {
    await delay(300);
    // No-op for mock, just simulate delay
    return { success: true };
  },

  async assignToCompanies(courseId: number, companySeatMap: Record<string, number>) {
    await delay(600);
    console.log(`[Mock] Assigned course ${courseId} to companies:`, companySeatMap);
    return { success: true };
  },

  async assignToJobRoles(courseId: number, jobRoleIds: number[]) {
    await delay(600);
    console.log(`[Mock] Assigned course ${courseId} to job roles:`, jobRoleIds);
    return { success: true };
  }
};
