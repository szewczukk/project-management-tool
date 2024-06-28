import api from '@/utils/api';
import { projectWithEpicsSchema } from '@/utils/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import Kanban from './Kanban';
import CreateTaskModal, { CreateTaskData } from './CreateTaskModal';
import { useRef } from 'react';

const getProjectResponseSchema = z.object({
	data: projectWithEpicsSchema,
});

export default function ProjectPage() {
	const { id } = useParams();
	const ref = useRef<HTMLDialogElement>(null);
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
	const { mutate: createTask } = useMutation({
		mutationFn: async (data: CreateTaskData) => {
			if (!data.task.epicId) {
				const response = await api.post(`/projects/${id}/tasks`, data);
				return response.data.data;
			}

			const response = await api.post(
				`/projects/${id}/epics/${data.task.epicId}/tasks`,
				data,
			);

			return response.data.data;
		},
	});

	const handleCreateTask = (data: CreateTaskData) => {
		createTask(data);
		ref.current!.close();
	};

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
				<button onClick={() => ref.current?.showModal()}>
					Create a new task
				</button>
			</nav>
			<ul className="flex flex-col gap-4 p-2">
				<Kanban tasks={project.tasks} />

				{project.epics.map((epic) => (
					<Kanban tasks={epic.tasks} epicTitle={epic.title} key={epic.id} />
				))}
			</ul>
			<CreateTaskModal
				onCreateTask={handleCreateTask}
				epics={project.epics}
				ref={ref}
			/>
		</div>
	);
}
