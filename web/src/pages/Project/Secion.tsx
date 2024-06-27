import { Task } from '@/utils/types';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';

type Props = {
	status: Task['status'];
	tasks: Task[];
	droppableId: string;
};

function showStatus(status: Task['status']) {
	switch (status) {
		case 'doing':
			return 'Doing 🧑‍💻';
		case 'todo':
			return 'To do 🤔';
		case 'done':
			return 'Done 🎉';
	}
}

export default function Section({ status, tasks, droppableId }: Props) {
	const { setNodeRef, isOver } = useDroppable({
		id: droppableId,
	});

	const style = {
		color: isOver ? 'green' : undefined,
	};

	return (
		<div
			className="flex flex-1 flex-col items-center gap-2 p-4"
			ref={setNodeRef}
			style={style}
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
