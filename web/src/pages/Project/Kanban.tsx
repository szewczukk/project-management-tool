import { Task } from '@/utils/types';
import { useMemo } from 'react';

type Props = {
	epicTitle?: string;
	tasks: Task[];
};

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
				{[...groupedTasks.entries()].map(([status, todos]) => (
					<div className="flex flex-1 flex-col items-center gap-2 p-4">
						<p className="text-center">{status}</p>
						<ul key={status}>
							{todos.map((todo) => (
								<li key={todo.id}>
									<div className="min-h-32 w-32 rounded-sm border border-slate-300 bg-slate-100 p-4">
										<p>{todo.title}</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}
