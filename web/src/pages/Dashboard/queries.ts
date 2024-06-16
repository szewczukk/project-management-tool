import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Project, projectSchema } from '@/utils/types';
import api from '@/utils/api';

export const queryProjectsResponseSchema = z.object({
	data: z.array(projectSchema),
});

export function useProjectsQuery() {
	return useQuery({
		queryKey: ['projects'],
		queryFn: async () => {
			const response = await api.get('/projects');

			const projects = queryProjectsResponseSchema.parse(response.data).data;
			return projects;
		},
	});
}

export type CreateProjectData = { project: Omit<Project, 'id'> };

export const mutateProjectResponseSchema = z.object({
	data: projectSchema,
});

export function useCreateProjectMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateProjectData) => {
			const response = await api.post('/projects', data);

			const projects = mutateProjectResponseSchema.parse(response.data).data;
			return projects;
		},
		onSuccess(data) {
			queryClient.setQueryData(['projects'], (old) => {
				if (Array.isArray(old)) {
					return [...old, data];
				}

				return [data];
			});
		},
	});
}
