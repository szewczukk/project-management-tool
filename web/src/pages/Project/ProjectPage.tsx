import api from '@/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import Kanban from './Kanban';
import SubmitTaskModal, { SubmitTaskData } from './SubmitTaskModal';
import { useRef } from 'react';
import { useProjectById } from './queries';
import OpenSubmitTaskModalContext from './contexts/OpenSubmitTaskModalContext';
import OpenSubmitTaskModalButton from './OpenSubmitTaskModalButton';

export default function ProjectPage() {
	const { id } = useParams();
	const { data: project, error, status } = useProjectById(parseInt(id!));
	const queryClient = useQueryClient();
	const ref = useRef<HTMLDialogElement>(null);
	const { mutate: createTask } = useMutation({
		mutationFn: async (data: SubmitTaskData) => {
			if (data.task.epicId === -1) {
				const response = await api.post(`/projects/${id}/tasks`, data);
				return response.data.data;
			}

			const response = await api.post(
				`/projects/${id}/epics/${data.task.epicId}/tasks`,
				data,
			);

			return response.data.data;
		},
		onSuccess(data, variables) {
			queryClient.setQueryData(['projects', id], (old) => {
				if (variables.task.epicId === -1) {
					old.tasks.push(data);
					return old;
				}

				const epicIndex = old.epics.findIndex(
					(epic) => epic.id.toString() === variables.task.epicId?.toString(),
				);

				old.epics[epicIndex].tasks.push(data);
				return old;
			});
		},
	});

	const handleCreateTask = (data: SubmitTaskData) => {
		createTask(data);
		ref.current!.close();
	};

	const openSubmitTaskModal = () => {
		ref.current?.showModal();
	};

	if (status === 'error') {
		return <p>Error {JSON.stringify(error)}</p>;
	}

	if (status === 'pending') {
		return <p>Loading..</p>;
	}

	return (
		<OpenSubmitTaskModalContext openSubmitTaskModal={openSubmitTaskModal}>
			<div className="flex h-screen w-full flex-col overflow-hidden">
				<nav className="flex items-center justify-between bg-slate-200 p-4">
					<h1>Project: {project.title}</h1>
					<div>
						<OpenSubmitTaskModalButton />
					</div>
				</nav>
				<ul className="flex flex-col gap-4 overflow-y-auto p-4">
					<Kanban tasks={project.tasks} />

					{project.epics.map((epic) => (
						<Kanban tasks={epic.tasks} epic={epic} key={epic.id} />
					))}
				</ul>
				<SubmitTaskModal
					onSubmitTask={handleCreateTask}
					epics={project.epics}
					ref={ref}
				/>
			</div>
		</OpenSubmitTaskModalContext>
	);
}
