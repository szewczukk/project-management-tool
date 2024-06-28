import api from '@/utils/api';
import { projectWithEpicsSchema } from '@/utils/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import Kanban from './Kanban';
import CreateTaskModal, { CreateTaskData } from './CreateTaskModal';
import { useRef } from 'react';
import Button from '@/components/Button';

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
		<div className="flex h-screen w-full flex-col overflow-hidden">
			<nav className="flex items-center justify-between bg-slate-200 p-4">
				<h1>Project: {project.title}</h1>
				<div>
					<Button onClick={() => ref.current?.showModal()}>
						Create a new task
					</Button>
				</div>
			</nav>
			<ul className="flex flex-col gap-4 overflow-y-auto p-4">
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
