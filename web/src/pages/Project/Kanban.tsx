import { Task } from '@/utils/types';
import { useMemo } from 'react';
import TaskCard from './TaskCard';

type Props = {
	epicTitle?: string;
	tasks: Task[];
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

export default function Kanban({ tasks, epicTitle }: Props) {
	const groupedTasks = useMemo(() => {
		return tasks.reduce<Map<Task['status'], Task[]>>(
			(acc, curr) => {
				return acc.set(curr.status, acc.get(curr.status)!.concat([curr]));
			},
			new Map([
				['todo', []],
				['doing', []],
				['done', []],
			]),
		);
	}, [tasks]);

	return (
		<div className="flex flex-col gap-2 bg-slate-100 p-4">
			<h2>Epic: {epicTitle || 'Non-aligned'}</h2>
			<div className="flex flex-wrap gap-4">
				{[...groupedTasks.entries()].map(([status, tasks]) => (
					<div className="flex flex-1 flex-col items-center gap-2 p-4">
						<p className="text-center">{showStatus(status)}</p>
						<ul key={status}>
							{tasks.map((task) => (
								<li key={task.id}>
									<TaskCard task={task} />
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}
