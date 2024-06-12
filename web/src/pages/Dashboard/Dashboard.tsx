import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import ProjectsList from './ProjectsList';
import { projectSchema } from '@/utils/types';

export default function Dashboard() {
	const { data, error, status } = useProjectsQuery();

	if (status === 'pending') {
		return <p>Loading..</p>;
	}

	if (status === 'error') {
		return <p>Error {JSON.stringify(error)}</p>;
	}

	return (
		<div className="container mx-auto mt-8 max-w-[960px]">
			<ProjectsList projects={data} />
		</div>
	);
}

const schema = z.object({
	data: z.array(projectSchema),
});

function useProjectsQuery() {
	return useQuery({
		queryKey: ['projects'],
		queryFn: async () => {
			const response = await fetch('http://localhost:4000/api/projects');
			const result = await response.json();

			const projects = schema.parse(result).data;
			return projects;
		},
	});
}
