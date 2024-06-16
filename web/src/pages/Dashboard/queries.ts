import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Project, projectSchema } from '@/utils/types';

export const queryProjectsResponseSchema = z.object({
	data: z.array(projectSchema),
});

export function useProjectsQuery() {
	return useQuery({
		queryKey: ['projects'],
		queryFn: async () => {
			const response = await fetch('http://localhost:4000/api/projects');
			const result = await response.json();

			const projects = queryProjectsResponseSchema.parse(result).data;
			return projects;
		},
	});
}

export type CreateProjectData = { project: Omit<Project, 'id'> };

export const mutateProjectResponseSchema = z.object({
	data: projectSchema,
});

export function useCreateProjectMutation() {
	return useMutation({
		mutationFn: async (data: CreateProjectData) => {
			const response = await fetch('http://localhost:4000/api/projects', {
				method: 'POST',
				body: JSON.stringify(data),
			});
			const result = await response.json();

			const projects = mutateProjectResponseSchema.parse(result).data;
			return projects;
		},
	});
}
