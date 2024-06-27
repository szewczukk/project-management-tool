import api from '@/utils/api';
import { projectWithEpicsSchema } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import Kanban from './Kanban';

const getProjectResponseSchema = z.object({
	data: projectWithEpicsSchema,
});

export default function ProjectPage() {
	const { id } = useParams();
	const {
		data: project,
		error,
		status,
	} = useQuery({
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
		<div className="h-screen w-full">
			<nav className="bg-slate-100 p-4">
				<h1>Project: {project.title}</h1>
			</nav>
			<ul className="flex flex-col gap-4 p-2">
				<Kanban tasks={project.tasks} projectId={project.id} />

				{project.epics.map((epic) => (
					<Kanban
						tasks={epic.tasks}
						epicTitle={epic.title}
						projectId={project.id}
					/>
				))}
			</ul>
		</div>
	);
}
