import InputGroup from '@/components/InputGroup';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useFormik } from 'formik';
import { Task } from '@/utils/types';

export type CreateTaskData = { task: Omit<Task, 'id'> };

type Props = {
	onCreateTask: (data: CreateTaskData) => void;
};

export default forwardRef<HTMLDialogElement, Props>(function CreateTaskModal(
	{ onCreateTask },
	ref,
) {
	const innerRef = useRef<HTMLDialogElement>(null);
	const formik = useFormik<CreateTaskData['task']>({
		initialValues: { title: '', status: 'todo' },
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
					onChange={formik.handleChange}
					value={formik.values.title}
				/>
				<select
					id="status"
					onChange={formik.handleChange}
					value={formik.values.status}
				>
					<option value="todo">To do</option>
					<option value="inprogress">In progress</option>
					<option value="done">Done</option>
				</select>
				<button
					className="rounded-sm bg-[#651E3E] py-2 text-white outline-offset-2 hover:bg-[#511832]"
					type="submit"
				>
					Create Task
				</button>
			</form>
			<button onClick={() => innerRef.current?.close()}>X</button>
		</dialog>
	);
});
