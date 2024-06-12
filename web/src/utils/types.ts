import { z } from 'zod';

export const projectSchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
});

export type Project = z.infer<typeof projectSchema>;
