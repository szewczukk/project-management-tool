import { showPriority } from '@/utils/helpers';
import { Task } from '@/utils/types';
import { useDraggable } from '@dnd-kit/core';
import { MouseEventHandler } from 'react';

type Props = {
	task: Task;
	onDoubleClick: MouseEventHandler<HTMLDivElement>;
};

export default function TaskCard({ task, onDoubleClick }: Props) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: `taskCard:${task.id}`,
		data: { taskId: task.id },
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	return (
		<div
			className="flex min-h-24 w-72 flex-col justify-between rounded-sm border border-slate-300 bg-slate-100 p-4"
			ref={setNodeRef}
			style={style}
			onDoubleClick={onDoubleClick}
			{...listeners}
			{...attributes}
		>
			<p className="text-sm">{task.title}</p>
			<p className="text-sm italic text-gray-500">
				{showPriority(task.priority)}
			</p>
		</div>
	);
}
