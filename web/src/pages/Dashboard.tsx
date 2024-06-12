import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

export default function Dashboard() {
	const { data, error, status } = useProjectsQuery();

	if (status === 'pending') {
		return <p>Loading..</p>;
	}

	if (status === 'error') {
		return <p>Error {JSON.stringify(error)}</p>;
	}

	return (
		<div>
			<h1 className="text-red-500">Hello, world!</h1>
			<ul>
				{data.map((project) => (
					<li key={project.id}>{project.title}</li>
				))}
			</ul>
		</div>
	);
}

const schema = z.object({
	data: z.array(
		z.object({
			id: z.number(),
			title: z.string(),
			description: z.string(),
		}),
	),
});

function useProjectsQuery() {
	const query = useQuery({
		queryKey: ['projects'],
		queryFn: async () => {
			const response = await fetch('http://localhost:4000/api/projects');
			const result = await response.json();

			const projects = schema.parse(result).data;
			return projects;
		},
	});

	return query;
}
