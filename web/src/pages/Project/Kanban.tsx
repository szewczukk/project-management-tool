import {
	Task,
	TaskStatus,
	taskSchema,
	taskStatusSchema,
	taskStatuses,
} from '@/utils/types';
import { act, useState } from 'react';
import { z } from 'zod';
import Section from './Secion';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';

type Props = {
	projectId: number;
	epicTitle?: string;
	tasks: Task[];
};

export default function Kanban({
	tasks: initialTasks,
	epicTitle,
	projectId,
}: Props) {
	const { mutate: changeTaskStatus } = useChangeTaskStatus(projectId);
	const [tasks, setTasks] = useState(initialTasks);

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

		setTasks((prev) =>
			prev.map((task) => {
				if (task.id === taskId) {
					return { ...task, status };
				}

				return task;
			}),
		);
		changeTaskStatus({
			id: taskId,
			newStatus: status,
		});
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
							epicTitle={epicTitle || 'Non-aligned'}
						/>
					))}
				</DndContext>
			</div>
		</div>
	);
}

const mutateChangeTaskStatusResponseSchema = z.object({
	data: taskSchema,
});

export function useChangeTaskStatus(projectId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { id: number; newStatus: TaskStatus }) => {
			const response = await api.patch(`/tasks/${data.id}`, {
				task: { status: data.newStatus },
			});

			const task = mutateChangeTaskStatusResponseSchema.parse(
				response.data,
			).data;
			return task;
		},
		onSuccess(data) {
			queryClient.setQueryData(['projects', projectId], (old) => {
				return old.map((task) => {
					if (task.id === data.id) {
						return data;
					}

					return taskSchema;
				});
			});
		},
	});
}
