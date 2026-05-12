import { Course, Lesson, Purchase, Section, User } from '@prisma/client';

export type CourseWithSections = Course & {
  sections: (Section & {
    lessons: Lesson[];
  })[];
  purchases?: Purchase[];
};

export type SafeUser = Omit<User, 'password' | 'verifyToken' | 'resetToken'>;