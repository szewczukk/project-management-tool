import api from '@/utils/api';
import { projectSchema } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

const getProjectResponseSchema = z.object({
	data: projectSchema,
});

export default function ProjectPage() {
	const { id } = useParams();
	const { data, error, status } = useQuery({
		queryKey: ['projects', id],
		queryFn: async () => {
			const response = await api.get(`/projects/${id}`);

			const project = getProjectResponseSchema.parse(response.data).data;
			return project;
		},
	});

	if (status === 'error') {
		return <p>Error {JSON.stringify(error)}</p>;
	}

	if (status === 'pending') {
		return <p>Loading..</p>;
	}

	return <h1>{JSON.stringify(data)}</h1>;
}
