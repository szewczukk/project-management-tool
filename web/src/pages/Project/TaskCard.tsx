import { Task } from '@/utils/types';

type Props = {
	task: Task;
};

export default function TaskCard({ task }: Props) {
	return (
		<div className="min-h-32 w-32 rounded-sm border border-slate-300 bg-slate-100 p-4">
			<p>{task.title}</p>
		</div>
	);
}
