'use server';

import * as z from 'zod';

import { TechnologySchema } from '@/schemas';

export const createTechnology = async (values: z.infer<typeof TechnologySchema>) => {
  const validatedFields = TechnologySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid technology data' };
  }

  return { success: 'Registration successful' };
};
