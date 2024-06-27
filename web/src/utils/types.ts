import { z } from 'zod';

export const projectSchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
});

export type Project = z.infer<typeof projectSchema>;

export const taskSchema = z.object({
	id: z.number(),
	title: z.string(),
	status: z.literal('todo').or(z.literal('doing')).or(z.literal('done')),
});

export type Task = z.infer<typeof taskSchema>;

export const epicSchema = z.object({
	id: z.number(),
	title: z.string(),
	tasks: z.array(taskSchema),
});

export type Epic = z.infer<typeof epicSchema>;

export const projectWithEpicsSchema = projectSchema.extend({
	epics: z.array(epicSchema),
	tasks: z.array(taskSchema),
});

export type ProjectWithEpics = z.infer<typeof projectWithEpicsSchema>;
