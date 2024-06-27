import { Task, TaskStatus, taskStatuses } from '@/utils/types';
import { useState } from 'react';
import Section from './Secion';
import { DndContext, DragEndEvent } from '@dnd-kit/core';

type Props = {
	epicTitle?: string;
	tasks: Task[];
};

export default function Kanban({ tasks: initialTasks, epicTitle }: Props) {
	const [tasks, setTasks] = useState(initialTasks);

	const handleDragEnd = (event: DragEndEvent) => {
		const { over, active } = event;

		if (!over) {
			return;
		}

		setTasks((prev) =>
			prev.map((task) => {
				if (task.id === active.id) {
					return { ...task, status: over!.id as TaskStatus };
				}

				return task;
			}),
		);
	};

	return (
		<div className="flex flex-col gap-2 bg-slate-100 p-4">
			<h2>Epic: {epicTitle || 'Non-aligned'}</h2>
			<div className="flex flex-wrap gap-4">
				<DndContext onDragEnd={handleDragEnd}>
					{taskStatuses.map((status) => (
						<Section
							status={status}
							tasks={tasks.filter((task) => task.status === status)}
							key={status}
							droppableId={status}
						/>
					))}
				</DndContext>
			</div>
		</div>
	);
}
