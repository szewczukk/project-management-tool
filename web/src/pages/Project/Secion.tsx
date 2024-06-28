import { Task, TaskStatus } from '@/utils/types';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';

type Props = {
	status: TaskStatus;
	tasks: Task[];
	epicTitle: string;
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

export default function Section({ status, tasks, epicTitle }: Props) {
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
			<ul key={status}>
				{tasks.map((task) => (
					<li key={task.id}>
						<TaskCard task={task} />
					</li>
				))}
			</ul>
		</div>
	);
}
