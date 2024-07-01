import InputGroup from '@/components/InputGroup';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useFormik } from 'formik';
import { Epic, Task } from '@/utils/types';
import Button from '@/components/Button';
import { useEditTaskModal } from './contexts/EditTaskModalContext';

export type SubmitTaskData = { task: Omit<Task, 'id'> & { epicId?: number } };

type Props = {
	onSubmitTask: (data: SubmitTaskData) => void;
	epics: Epic[];
};

const SubmitTaskModal = forwardRef<HTMLDialogElement, Props>(
	function SubmitTaskModal(props, ref) {
		const { epics, onSubmitTask } = props;
		const { currentlyEditedTask } = useEditTaskModal();

		const innerRef = useRef<HTMLDialogElement>(null);
		const formik = useFormik<SubmitTaskData['task']>({
			initialValues: {
				title: currentlyEditedTask.task?.title || '',
				status: currentlyEditedTask.task?.status || 'todo',
				epicId: currentlyEditedTask.epic?.id || -1,
			},
			onSubmit: (values) => onSubmitTask({ task: values }),
		});

		useEffect(() => {
			formik.setValues({
				title: currentlyEditedTask.task?.title || '',
				status: currentlyEditedTask.task?.status || 'todo',
				epicId: currentlyEditedTask.epic?.id || -1,
			});
		}, [currentlyEditedTask]);

		useImperativeHandle(ref, () => innerRef.current!, []);

		return (
			<dialog ref={innerRef} className="w-[360px] rounded-sm p-8">
				<h2 className="mb-4 text-lg font-semibold">
					{currentlyEditedTask.task ? 'Edit Project' : 'Create Project'}
				</h2>
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
	},
);

export default SubmitTaskModal;
