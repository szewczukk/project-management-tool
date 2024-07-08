import InputGroup from '@/components/InputGroup';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useFormik } from 'formik';
import { Epic, Task } from '@/utils/types';
import Button from '@/components/Button';
import { useOpenSubmitTaskModal } from './contexts/OpenSubmitTaskModalContext';
import SelectGroup from '@/components/SelectGrup';

export type SubmitTaskData = {
	task: Omit<Task, 'id'> & { taskId?: number; epicId?: number };
};

type Props = {
	onSubmitTask: (data: SubmitTaskData) => void;
	onDeleteTask: (data: { epicId: number; taskId: number }) => void;
	epics: Epic[];
};

const SubmitTaskModal = forwardRef<HTMLDialogElement, Props>(
	function SubmitTaskModal(props, ref) {
		const { epics, onSubmitTask } = props;
		const { currentlyEdited } = useOpenSubmitTaskModal();

		const innerRef = useRef<HTMLDialogElement>(null);
		const formik = useFormik<SubmitTaskData['task']>({
			initialValues: {
				title: currentlyEdited?.task?.title || '',
				status: currentlyEdited?.task?.status || 'todo',
				epicId: currentlyEdited?.epic?.id || -1,
			},
			onSubmit: (values) =>
				onSubmitTask({ task: { ...values, taskId: currentlyEdited?.task.id } }),
		});

		useEffect(() => {
			formik.setValues({
				title: currentlyEdited?.task?.title || '',
				status: currentlyEdited?.task?.status || 'todo',
				epicId: currentlyEdited?.epic?.id || -1,
			});
		}, [currentlyEdited]);

		useImperativeHandle(ref, () => innerRef.current!, []);

		return (
			<dialog ref={innerRef} className="w-[360px] rounded-sm p-8">
				<div className="flex flex-col gap-4">
					<form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
						<InputGroup
							label="Title"
							type="text"
							id="title"
							placeholder="Enter project title.."
							{...formik.getFieldProps('title')}
						/>
						<SelectGroup
							label="Choose epic"
							options={[{ key: -1, title: '---' }].concat(
								epics.map((epic) => ({ key: epic.id, title: epic.title })),
							)}
							{...formik.getFieldProps('epicId')}
						/>
						<SelectGroup
							label="Choose status"
							options={[
								{ key: 'todo', title: 'To do' },
								{ key: 'inprogress', title: 'In progress' },
								{ key: 'done', title: 'Done' },
							]}
							{...formik.getFieldProps('status')}
						/>
						<Button type="submit">Create Task</Button>
					</form>
					<div className="flex gap-2">
						<Button
							variant="secondary"
							className="flex-1"
							onClick={() => innerRef.current?.close()}
						>
							Close
						</Button>
						{currentlyEdited && (
							<Button
								variant="secondary"
								className="flex-1"
								onClick={() =>
									props.onDeleteTask({
										epicId: currentlyEdited.epic?.id || -1,
										taskId: currentlyEdited.task.id,
									})
								}
							>
								Delete
							</Button>
						)}
					</div>
				</div>
			</dialog>
		);
	},
);

export default SubmitTaskModal;
