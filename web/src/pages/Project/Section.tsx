import { Epic, Task, TaskStatus } from '@/utils/types';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import SubmitTaskModal from './SubmitTaskModal';
import { useParams } from 'react-router-dom';
import { useProjectById } from './queries';
import { createPortal } from 'react-dom';

type Props = {
	status: TaskStatus;
	tasks: Task[];
	epic?: Epic;
};

function showStatus(status: TaskStatus) {
	switch (status) {
		case 'inprogress':
			return 'In progress 🧑‍💻';
		case 'todo':
			return 'To do 🤔';
		case 'done':
			return 'Done 🎉';
	}
}

export default function Section({ status, tasks, epic }: Props) {
	const submitTaskModalRef = useRef<HTMLDialogElement>(null);
	const [currentlyEditedTask, setCurrentlyEditedTask] = useState<
		Task | undefined
	>();
	const { id } = useParams();
	const { data: project } = useProjectById(parseInt(id!));

	const epicTitle = epic?.title || 'non-aligned';
	const { setNodeRef, isOver } = useDroppable({
		id: `${epicTitle}/${status}`,
		data: { status },
	});

	return (
		<div
			className={classNames(
				'flex flex-1 flex-col items-center gap-2 rounded-sm border p-4',
				{
					'border-slate-300': isOver,
					'border-transparent': !isOver,
				},
			)}
			ref={setNodeRef}
		>
			<p className="text-center">{showStatus(status)}</p>
			<ul key={status} className="flex flex-col gap-4">
				{tasks.map((task) => (
					<li key={task.id}>
						<TaskCard
							onDoubleClick={() => {
								setCurrentlyEditedTask(task);
								submitTaskModalRef.current?.showModal();
							}}
							task={task}
						/>
					</li>
				))}
			</ul>
			{createPortal(
				<SubmitTaskModal
					onSubmitTask={(data) => console.log(data)}
					epics={project!.epics}
					ref={submitTaskModalRef}
					editedTask={currentlyEditedTask}
					editedTaskEpic={epic}
				/>,
				document.body,
			)}
		</div>
	);
}
