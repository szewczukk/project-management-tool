import { Task } from '@/utils/types';
import { useDraggable } from '@dnd-kit/core';

type Props = {
	task: Task;
};

export default function TaskCard({ task }: Props) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: task.id,
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	return (
		<div
			className="min-h-32 w-32 rounded-sm border border-slate-300 bg-slate-100 p-4"
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
		>
			<p>{task.title}</p>
		</div>
	);
}
