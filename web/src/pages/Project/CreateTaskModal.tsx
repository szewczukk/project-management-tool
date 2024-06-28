import InputGroup from '@/components/InputGroup';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useFormik } from 'formik';
import { Epic, Task } from '@/utils/types';
import Button from '@/components/Button';

export type CreateTaskData = { task: Omit<Task, 'id'> & { epicId?: number } };

type Props = {
	onCreateTask: (data: CreateTaskData) => void;
	epics: Epic[];
};

export default forwardRef<HTMLDialogElement, Props>(function CreateTaskModal(
	{ onCreateTask, epics },
	ref,
) {
	const innerRef = useRef<HTMLDialogElement>(null);
	const formik = useFormik<CreateTaskData['task']>({
		initialValues: { title: '', status: 'todo', epicId: -1 },
		onSubmit: (values) => onCreateTask({ task: values }),
	});

	useImperativeHandle(ref, () => innerRef.current!, []);

	return (
		<dialog ref={innerRef} className="w-[360px] rounded-sm p-8">
			<h2 className="mb-4 text-lg font-semibold">Create Project</h2>
			<form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
				<InputGroup
					label="Title"
					type="text"
					id="title"
					placeholder="Enter project title.."
					{...formik.getFieldProps('title')}
				/>
				<select id="epicId" {...formik.getFieldProps('epicId')}>
					<option value={-1}>---</option>
					{epics.map((epic) => (
						<option value={epic.id} key={epic.id}>
							{epic.title}
						</option>
					))}
				</select>
				<select id="status" {...formik.getFieldProps('status')}>
					<option value="todo">To do</option>
					<option value="inprogress">In progress</option>
					<option value="done">Done</option>
				</select>
				<Button type="submit">Create Task</Button>
			</form>
			<button onClick={() => innerRef.current?.close()}>X</button>
		</dialog>
	);
});
