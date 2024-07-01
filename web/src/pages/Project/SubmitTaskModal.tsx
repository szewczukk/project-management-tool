import InputGroup from '@/components/InputGroup';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useFormik } from 'formik';
import { Epic, Task } from '@/utils/types';
import Button from '@/components/Button';

export type SubmitTaskData = { task: Omit<Task, 'id'> & { epicId?: number } };

type Props = {
	onSubmitTask: (data: SubmitTaskData) => void;
	epics: Epic[];
} & (
	| {
			// if we don't do it like this,
			// then we wouldn't have conditional types or the editedTask would be a required attribute.
			editedTask?: undefined;
	  }
	| {
			editedTask: Task;
			editedTaskEpic: Epic | undefined;
	  }
);

const SubmitTaskModal = forwardRef<HTMLDialogElement, Props>(
	function SubmitTaskModal(props, ref) {
		const { epics, onSubmitTask } = props;

		const innerRef = useRef<HTMLDialogElement>(null);
		const formik = useFormik<SubmitTaskData['task']>({
			initialValues: {
				title: props.editedTask?.title || '',
				status: props.editedTask?.status || 'todo',
				epicId: props.editedTask ? props.editedTaskEpic?.id || -1 : -1,
			},
			onSubmit: (values) => onSubmitTask({ task: values }),
		});

		useEffect(() => {
			const { editedTask } = props;

			if (!editedTask) {
				return;
			}

			formik.setValues({
				title: editedTask.title,
				status: editedTask.status,
				epicId: props.editedTaskEpic?.id || -1,
			});
		}, [props.editedTask]);

		useImperativeHandle(ref, () => innerRef.current!, []);

		return (
			<dialog ref={innerRef} className="w-[360px] rounded-sm p-8">
				<h2 className="mb-4 text-lg font-semibold">
					{props.editedTask ? 'Edit Project' : 'Create Project'}
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
