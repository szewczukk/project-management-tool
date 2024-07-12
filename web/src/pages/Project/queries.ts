import api from '@/utils/api';
import {
	Task,
	accountSchema,
	projectWithEpicsSchema,
	taskSchema,
} from '@/utils/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { SubmitTaskData } from './SubmitTaskModal';
import { SubmitEpicData } from './SubmitEpicModal';

export function useProjectById(id: number) {
	return useQuery({
		queryKey: ['projects', id],
		queryFn: async () => {
			const response = await api.get(`/projects/${id}`);

			const project = projectWithEpicsSchema.parse(response.data.data);
			return project;
		},
	});
}

export function useCreateTaskMutation(projectId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: SubmitTaskData) => {
			const body = { ...data.task };

			if (data.task.assigneeId !== -1) {
				body.assignee_id = data.task.assigneeId;
			}

			if (data.task.epicId === -1) {
				const response = await api.post(`/projects/${projectId}/tasks`, {
					task: body,
				});
				return response.data.data;
			}

			const response = await api.post(
				`/projects/${projectId}/epics/${data.task.epicId}/tasks`,
				{ task: body },
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
	task: Task & { epicId?: number; assigneeId?: number };
};

export function useEditTaskMutation(projectId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: EditTaskData) => {
			const body = { ...data.task };

			if (data.task.assigneeId?.toString() !== '-1') {
				body.assignee_id = data.task.assigneeId;
			} else {
				body.assignee_id = null;
			}

			if (data.task.epicId?.toString() !== '-1') {
				body.epic_id = data.task.epicId;
			}

			const response = await api.patch(`/tasks/${data.task.id}`, {
				task: body,
			});
			return taskSchema.parse(response.data.data);
		},
		onSuccess(data) {
			queryClient.setQueryData(['projects', projectId], (old) => {
				console.log(data);
				if (!data.epicId) {
					const taskId = old.tasks.findIndex((task) => task.id === data.id);
					old.tasks[taskId] = data;

					return old;
				}

				const epicId = old.epics.findIndex((epic) => epic.id === data.epicId);
				const taskId = old.epics[epicId].tasks.findIndex(
					(task) => task.id === data.id,
				);
				old.epics[epicId].tasks[taskId] = data;

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

export function useDeleteTaskMutation(projectId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ taskId }: { taskId: number; epicId: number }) => {
			return await api.delete(`/tasks/${taskId}`);
		},
		onSuccess(_data, variables) {
			queryClient.setQueryData(['projects', projectId], (old) => {
				if (variables.epicId === -1) {
					const deletedIndex = old.tasks.findIndex(
						(task) => task.id === variables.taskId,
					);

					delete old.tasks[deletedIndex];

					return old;
				}
				const epicIndex = old.epics.findIndex(
					(epic) => epic.id === variables.epicId,
				);
				const taskIndex = old.epics[epicIndex].tasks.findIndex(
					(task) => task.id === variables.taskId,
				);

				delete old.epics[epicIndex].tasks[taskIndex];

				return old;
			});
		},
	});
}

export function useDeleteEpicMutation(projectId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (epicId: number) => {
			return await api.delete(`/epics/${epicId}`);
		},
		onSuccess(_data, epicId) {
			queryClient.setQueryData(['projects', projectId], (old) => {
				return {
					...old,
					epics: old.epics.filter((epic) => epic.id !== epicId),
				};
			});
		},
	});
}

export function useGetAllAccounts() {
	return useQuery({
		queryKey: ['accounts'],
		queryFn: async () => {
			const response = await api.get('/accounts');
			const result = z.array(accountSchema).parse(response.data.data);

			return result;
		},
	});
}
