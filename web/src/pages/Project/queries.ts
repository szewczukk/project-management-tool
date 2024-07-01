import api from '@/utils/api';
import { projectWithEpicsSchema } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const getProjectResponseSchema = z.object({
	data: projectWithEpicsSchema,
});

export function useProjectById(id: number) {
	return useQuery({
		queryKey: ['projects', id],
		queryFn: async () => {
			const response = await api.get(`/projects/${id}`);

			const project = getProjectResponseSchema.parse(response.data).data;
			return project;
		},
	});
}
