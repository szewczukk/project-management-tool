import { z } from 'zod';

export const projectSchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
});

export type Project = z.infer<typeof projectSchema>;

export const taskStatuses = ['todo', 'inprogress', 'done'] as const;
export const taskStatusSchema = z.enum(taskStatuses);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskSchema = z.object({
	id: z.number(),
	title: z.string(),
	status: taskStatusSchema,
});

export type Task = z.infer<typeof taskSchema>;

export const epicPriorities = ['low', 'medium', 'high'] as const;
export const epicPrioritySchema = z.enum(epicPriorities);
export type EpicPriority = z.infer<typeof epicPrioritySchema>;

export const epicSchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	priority: epicPrioritySchema,
	status: taskStatusSchema,
	tasks: z.array(taskSchema),
});

export type Epic = z.infer<typeof epicSchema>;

export const projectWithEpicsSchema = projectSchema.extend({
	epics: z.array(epicSchema),
	tasks: z.array(taskSchema),
});

export type ProjectWithEpics = z.infer<typeof projectWithEpicsSchema>;
