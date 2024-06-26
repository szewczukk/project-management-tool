import api from '@/utils/api';
import { projectWithEpicsSchema } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

const getProjectResponseSchema = z.object({
	data: projectWithEpicsSchema,
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

	return (
		<div className="flex h-screen">
			<aside className="h-full w-[256px] bg-slate-200">
				<ul>
					{data.epics.map((epic) => (
						<li
							key={epic.id}
							className="w-full cursor-pointer p-4 hover:bg-slate-300"
						>
							{epic.title}
						</li>
					))}
				</ul>
			</aside>
			<div className="w-full">
				<div className="bg-slate-100 p-2">
					<h1>Project: {data.title}</h1>
				</div>
			</div>
		</div>
	);
}
