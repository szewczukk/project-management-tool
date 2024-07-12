import { Link, useParams } from 'react-router-dom';
import Kanban from './Kanban';
import SubmitTaskModal, { SubmitTaskData } from './SubmitTaskModal';
import { useRef } from 'react';
import {
	useEditTaskMutation,
	useProjectById,
	useCreateTaskMutation,
	useCreateEpicMutation,
	useEditEpicMutation,
	useDeleteTaskMutation,
} from './queries';
import OpenSubmitTaskModalContext from './contexts/OpenSubmitTaskModalContext';
import ProjectControls from './ProjectControls';
import OpenSubmitEpicModalContext from './contexts/OpenSubmitEpicModalContext';
import SubmitEpicModal, { SubmitEpicData } from './SubmitEpicModal';
import { useCurrentUser } from '@/utils/hooks';

export default function ProjectPage() {
	const { id } = useParams();
	const { data: project, error, status } = useProjectById(parseInt(id!));
	const submitTaskModalRef = useRef<HTMLDialogElement>(null);
	const submitEpicModalRef = useRef<HTMLDialogElement>(null);
	const { mutate: createTask } = useCreateTaskMutation(parseInt(id!));
	const { mutate: editTask } = useEditTaskMutation(parseInt(id!));
	const { mutate: createEpic } = useCreateEpicMutation(parseInt(id!));
	const { mutate: editEpic } = useEditEpicMutation(parseInt(id!));
	const { mutate: deleteTask } = useDeleteTaskMutation(parseInt(id!));
	const { data: currentUser } = useCurrentUser();

	const handleSubmitTask = (data: SubmitTaskData) => {
		if (data.task.taskId) {
			editTask({ task: { ...data.task, id: data.task.taskId } });
		} else {
			createTask(data);
		}

		submitTaskModalRef.current!.close();
	};

	const handleSubmitEpic = (data: SubmitEpicData) => {
		if (data.epic.epicId) {
			editEpic(data);
		} else {
			createEpic(data);
		}

		submitEpicModalRef.current?.close();
	};

	const openSubmitTaskModal = () => {
		submitTaskModalRef.current?.showModal();
	};

	const openSubmitEpicModal = () => {
		submitEpicModalRef.current?.showModal();
	};

	if (status === 'error') {
		return <p>Error {JSON.stringify(error)}</p>;
	}

	if (status === 'pending') {
		return <p>Loading..</p>;
	}

	return (
		<OpenSubmitTaskModalContext openSubmitTaskModal={openSubmitTaskModal}>
			<OpenSubmitEpicModalContext openSubmitEpicModal={openSubmitEpicModal}>
				<div className="flex h-screen w-full flex-col overflow-hidden">
					<nav className="flex items-center justify-between bg-slate-200 p-4">
						<div className="flex items-center gap-4">
							<Link className="text-sm text-gray-500" to="/">
								Go back..
							</Link>
							<h1>Project: {project.title}</h1>
						</div>
						<ProjectControls />
						<p>Welcome, {currentUser?.username}!</p>
					</nav>
					<ul className="flex flex-col gap-4 overflow-y-auto p-4">
						<Kanban tasks={project.tasks} projectId={parseInt(id!)} />

						{project.epics.map((epic) => (
							<Kanban
								tasks={epic.tasks}
								epic={epic}
								key={epic.id}
								projectId={parseInt(id!)}
							/>
						))}
					</ul>
					<SubmitTaskModal
						onSubmitTask={handleSubmitTask}
						epics={project.epics}
						ref={submitTaskModalRef}
						onDeleteTask={({ epicId, taskId }) => {
							deleteTask({ epicId, taskId });
							submitTaskModalRef.current?.close();
						}}
					/>
					<SubmitEpicModal
						onSubmitEpic={handleSubmitEpic}
						projectId={parseInt(id!)}
						ref={submitEpicModalRef}
					/>
				</div>
			</OpenSubmitEpicModalContext>
		</OpenSubmitTaskModalContext>
	);
}
