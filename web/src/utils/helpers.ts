import { EpicPriority, TaskStatus } from './types';

export function showStatus(status: TaskStatus) {
	switch (status) {
		case 'inprogress':
			return 'In progress 🧑‍💻';
		case 'todo':
			return 'To do 🤔';
		case 'done':
			return 'Done 🎉';
	}
}

export function showPriority(priority: EpicPriority) {
	switch (priority) {
		case 'high':
			return 'High 🔥';
		case 'medium':
			return 'Medium 🌞';
		case 'low':
			return 'Low 🛌';
	}
}
