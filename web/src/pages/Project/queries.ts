import api from '@/utils/api';
import { Task, projectWithEpicsSchema } from '@/utils/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { SubmitTaskData } from './SubmitTaskModal';
import { SubmitEpicData } from './SubmitEpicModal';

const getProjectResponseSchema = z.object({
	data: projectWithEpicsSchema,
});

export function useProjectById(id: number) {
	return useQuery({
		queryKey: ['projects', id],
		queryFn: async () => {
			const response = await api.get(`/projects/${id}`);

			const project = getProjectResponseSchema.parse(response.data).data;
			return project;
		},
	});
}

export function useCreateTaskMutation(projectId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: SubmitTaskData) => {
			if (data.task.epicId === -1) {
				const response = await api.post(`/projects/${projectId}/tasks`, data);
				return response.data.data;
			}

			const response = await api.post(
				`/projects/${projectId}/epics/${data.task.epicId}/tasks`,
				data,
			);

			return response.data.data;
		},
		onSuccess(data, variables) {
			queryClient.setQueryData(['projects', projectId], (old) => {
				// If the task is in non-aligned
				if (variables.task.epicId === -1) {
					old.tasks.push(data);
					return old;
				}

				// If the task is in epic
				const epicIndex = old.epics.findIndex(
					(epic) => epic.id.toString() === variables.task.epicId?.toString(),
				);

				old.epics[epicIndex].tasks.push(data);
				return old;
			});
		},
	});
}

export type EditTaskData = {
	task: Task & { epicId?: number };
};

export function useEditTaskMutation(projectId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: EditTaskData) => {
			const response = await api.patch(`/tasks/${data.task.id}`, {
				task: {
					...data.task,
					epic_id:
						data.task.epicId?.toString() === (-1).toString()
							? null
							: data.task.epicId,
				},
			});
			return response.data.data;
		},
		onSuccess(data, variables) {
			queryClient.setQueryData(['projects', projectId], (old) => {
				// If the epic didn't change
				if (variables.task.epicId === data.epicId) {
					// If the epic is unaligned
					if (variables.task.epicId === -1) {
						const taskIndex = old.tasks.findIndex(
							(task) =>
								task.id.toString() === variables.task.taskId?.toString(),
						);

						old.tasks[taskIndex] = data;
						return old;
					}

					// If the epic is non-aligned
					const epicIndex = old.epics.findIndex((epic) =>
						epic.tasks.some(
							(task) => task.id.toString() === data.id.toString(),
						),
					);

					const taskIndex = old.epics[epicIndex].tasks.findIndex(
						(task) => task.id.toString() === variables.task.id.toString(),
					);

					old.epics[taskIndex] = data;

					return old;
				}

				// If the epic did change and it went from non-aligned to aligned
				if (variables.task.epicId !== -1 && data.epicId !== null) {
					const taskIndex = old.tasks.findIndex(
						(task) => task.id.toString() === data.id.toString(),
					);
					old.tasks.splice(taskIndex, 1);

					const newEpicIndex = old.epics.findIndex(
						(epic) => epic.id.toString() === data.epicId.toString(),
					);
					old.epics[newEpicIndex].tasks.push(data);
					return old;
				}

				// If the epic did change and it went from aligned to non-aligned
				if (data.epicId === null) {
				}

				return old;
			});
		},
	});
}

export function useCreateEpicMutation(projectId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: SubmitEpicData) => {
			const response = await api.post(
				`/projects/${data.epic.projectId}/epics`,
				data,
			);

			return response.data.data;
		},
		onSuccess(data) {
			queryClient.setQueryData(['projects', projectId], (old) => {
				old.epics.push(data);
				return old;
			});
		},
	});
}

export function useEditEpicMutation(projectId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: SubmitEpicData) => {
			const response = await api.patch(`/epics/${data.epic.epicId}`, data);

			return response.data.data;
		},
		onSuccess(data) {
			queryClient.setQueryData(['projects', projectId], (old) => {
				const epicIndex = old.epics.findIndex(
					(epic) => epic.id.toString() === data.id?.toString(),
				);
				old.epics[epicIndex] = data;

				return old;
			});
		},
	});
}
