import InputGroup from '@/components/InputGroup';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useFormik } from 'formik';
import { Epic, Task } from '@/utils/types';
import Button from '@/components/Button';
import { useOpenSubmitTaskModal } from './contexts/OpenSubmitTaskModalContext';
import SelectGroup from '@/components/SelectGrup';
import { useGetAllAccounts } from './queries';

export type SubmitTaskData = {
	task: Omit<Task, 'id' | 'started_at' | 'completed_at' | 'assignee'> & {
		taskId?: number;
		epicId?: number;
		assigneeId?: number;
	};
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
		const { data: accounts } = useGetAllAccounts();

		const innerRef = useRef<HTMLDialogElement>(null);
		const formik = useFormik<SubmitTaskData['task']>({
			initialValues: {
				title: currentlyEdited?.task?.title || '',
				description: currentlyEdited?.task.description || '',
				status: currentlyEdited?.task?.status || 'todo',
				priority: currentlyEdited?.task.priority || 'medium',
				epicId: currentlyEdited?.epic?.id || -1,
				assigneeId: currentlyEdited?.task.assignee?.id || -1,
			},
			onSubmit: (values) =>
				onSubmitTask({ task: { ...values, taskId: currentlyEdited?.task.id } }),
		});

		useEffect(() => {
			formik.setValues({
				title: currentlyEdited?.task?.title || '',
				description: currentlyEdited?.task.description || '',
				status: currentlyEdited?.task?.status || 'todo',
				priority: currentlyEdited?.task.priority || 'medium',
				epicId: currentlyEdited?.epic?.id || -1,
				assigneeId: currentlyEdited?.task.assignee?.id || -1,
			});
		}, [currentlyEdited]);

		useImperativeHandle(ref, () => innerRef.current!, []);

		return (
			<dialog ref={innerRef} className="w-[512px] rounded-sm p-8">
				<div className="flex flex-col gap-4">
					{currentlyEdited?.task.started_at && (
						<p>
							Started at:{' '}
							{new Date(currentlyEdited.task.started_at).toUTCString()}
						</p>
					)}
					{currentlyEdited?.task.completed_at && (
						<p>
							Completed at:{' '}
							{new Date(currentlyEdited.task.completed_at).toUTCString()}
						</p>
					)}
					<form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
						<InputGroup
							label="Title"
							type="text"
							id="title"
							placeholder="Enter project title.."
							{...formik.getFieldProps('title')}
						/>
						<InputGroup
							label="Description"
							id="description"
							placeholder="Enter epic description.."
							isTextArea
							{...formik.getFieldProps('description')}
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
						<SelectGroup
							label="Choose priority"
							options={[
								{ key: 'high', title: 'High' },
								{ key: 'medium', title: 'Medium' },
								{ key: 'low', title: 'Low' },
							]}
							{...formik.getFieldProps('priority')}
						/>
						<SelectGroup
							label="Choose an assignee"
							options={[{ key: -1, title: '---' }].concat(
								accounts?.map((account) => ({
									key: account.id,
									title: account.username,
								})) || [],
							)}
							{...formik.getFieldProps('assigneeId')}
						/>
						<Button type="submit">
							{currentlyEdited ? 'Edit Task' : 'Create Task'}
						</Button>
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
