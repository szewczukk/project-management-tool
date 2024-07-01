import api from '@/utils/api';
import { Task, projectWithEpicsSchema } from '@/utils/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { SubmitTaskData } from './SubmitTaskModal';

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
			if (data.task.taskId) {
				const response = await api.patch(`/tasks/${data.task.taskId}`, data);
				return response.data.data;
			}
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
			const response = await api.patch(`/tasks/${data.task.id}`, data);
			return response.data.data;
		},
		onSuccess(data, variables) {
			queryClient.setQueryData(['projects', projectId], (old) => {
				// If the task is in epic
				if (variables.task.epicId !== -1) {
					const epicIndex = old.epics.findIndex(
						(epic) => epic.id.toString() === variables.task.epicId?.toString(),
					);

					const taskIndex = old.epics[epicIndex].tasks.findIndex(
						(task) => task.id.toString() === variables.task.taskId?.toString(),
					);

					old.epics[epicIndex].tasks[taskIndex] = data;
					return old;
				}

				// If task is non-aligned
				const taskIndex = old.tasks.findIndex(
					(task) => task.id.toString() === variables.task.taskId?.toString(),
				);

				old.tasks[taskIndex] = data;
				return old;
			});
		},
	});
}
