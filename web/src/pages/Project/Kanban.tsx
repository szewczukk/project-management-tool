import { Epic, Task, taskStatusSchema, taskStatuses } from '@/utils/types';
import { useState } from 'react';
import { z } from 'zod';
import Section from './Section';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import Button from '@/components/Button';
import { useOpenSubmitEpicModal } from './contexts/OpenSubmitEpicModalContext';
import { useDeleteEpicMutation, useEditTaskMutation } from './queries';
import { showPriority, showStatus } from '@/utils/helpers';

type Props = {
	projectId: number;
	epic?: Epic;
	tasks: Task[];
};

export default function Kanban({
	tasks: initialTasks,
	epic,
	projectId,
}: Props) {
	const { openSubmitEpicModal } = useOpenSubmitEpicModal();
	const { mutate: changeTaskStatus } = useEditTaskMutation(projectId);
	const [tasks, setTasks] = useState(initialTasks);
	const { mutate: deleteEpic } = useDeleteEpicMutation(projectId);

	const handleDragEnd = (event: DragEndEvent) => {
		const { over, active } = event;

		if (!over) {
			return;
		}

		const { taskId } = z
			.object({ taskId: z.number() })
			.parse(active.data.current);
		const { status } = z
			.object({ status: taskStatusSchema })
			.parse(over.data.current);

		const task = tasks.find((task) => task.id === taskId);

		if (!task || task.status === status) {
			return;
		}

		setTasks((prev) =>
			prev.map((task) => {
				if (task.id === taskId) {
					return { ...task, status };
				}

				return task;
			}),
		);
		changeTaskStatus({
			task: {
				...task,
				status,
			},
		});
	};

	return (
		<div className="flex flex-col gap-2 bg-slate-100 p-4">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-2">
					<h2>Epic: {epic ? epic.title : 'Non-aligned'}</h2>
					{epic && (
						<div className="flex gap-4 text-sm italic text-gray-500">
							<p>{showStatus(epic.status)}</p>
							<p>{showPriority(epic.priority)}</p>
							<p>Owner: {epic.owner.username}</p>
						</div>
					)}
				</div>
				<div>
					{epic && (
						<div className="flex gap-4">
							<Button
								variant="secondary"
								onClick={() => {
									if (epic) {
										openSubmitEpicModal({ epic, projectId });
									} else {
										openSubmitEpicModal({ projectId });
									}
								}}
							>
								Edit
							</Button>
							<Button
								variant="secondary"
								onClick={() => {
									deleteEpic(epic.id);
								}}
							>
								Delete
							</Button>
						</div>
					)}
				</div>
			</div>
			<div className="flex flex-wrap gap-4">
				<DndContext onDragEnd={handleDragEnd}>
					{taskStatuses.map((status) => (
						<Section
							status={status}
							tasks={tasks.filter((task) => task.status === status)}
							key={status}
							epic={epic}
						/>
					))}
				</DndContext>
			</div>
		</div>
	);
}
