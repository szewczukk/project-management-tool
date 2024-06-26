import { z } from 'zod';

export const projectSchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
});

export type Project = z.infer<typeof projectSchema>;

export const epicSchema = z.object({
	id: z.number(),
	title: z.string(),
});

export type Epic = z.infer<typeof epicSchema>;

export const projectWithEpicsSchema = projectSchema.extend({
	epics: z.array(epicSchema),
});

export type ProjectWithEpics = z.infer<typeof projectWithEpicsSchema>;
