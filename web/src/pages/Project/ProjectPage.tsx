import { useParams } from 'react-router-dom';
import Kanban from './Kanban';
import SubmitTaskModal, { SubmitTaskData } from './SubmitTaskModal';
import { useRef } from 'react';
import {
	useEditTaskMutation,
	useProjectById,
	useCreateTaskMutation,
} from './queries';
import OpenSubmitTaskModalContext from './contexts/OpenSubmitTaskModalContext';
import OpenSubmitTaskModalButton from './OpenSubmitTaskModalButton';

export default function ProjectPage() {
	const { id } = useParams();
	const { data: project, error, status } = useProjectById(parseInt(id!));
	const ref = useRef<HTMLDialogElement>(null);
	const { mutate: createTask } = useCreateTaskMutation(parseInt(id!));
	const { mutate: editTask } = useEditTaskMutation(parseInt(id!));

	const handleSubmitTask = (data: SubmitTaskData) => {
		if (data.task.taskId) {
			editTask({ task: { ...data.task, id: data.task.taskId } });
		} else {
			createTask(data);
		}

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
					onSubmitTask={handleSubmitTask}
					epics={project.epics}
					ref={ref}
				/>
			</div>
		</OpenSubmitTaskModalContext>
	);
}
