import InputGroup from '@/components/InputGroup';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useFormik } from 'formik';
import { Epic } from '@/utils/types';
import Button from '@/components/Button';
import { useOpenSubmitEpicModal } from './contexts/OpenSubmitEpicModalContext';

type FormValues = Omit<Epic, 'id' | 'tasks'>;

export type SubmitEpicData = {
	epic: FormValues & { epicId?: number; projectId: number };
};

type Props = {
	onSubmitEpic: (data: SubmitEpicData) => void;
	projectId: number;
};

const SubmitEpicModal = forwardRef<HTMLDialogElement, Props>(
	function SubmitEpicModal(props, ref) {
		const { projectId, onSubmitEpic } = props;
		const { currentlyEdited } = useOpenSubmitEpicModal();

		const innerRef = useRef<HTMLDialogElement>(null);
		const formik = useFormik<FormValues>({
			initialValues: {
				title: currentlyEdited?.epic?.title || '',
			},
			onSubmit: (values) =>
				onSubmitEpic({
					epic: { ...values, projectId, epicId: currentlyEdited?.epic?.id },
				}),
		});

		useEffect(() => {
			formik.setValues({
				title: currentlyEdited?.epic?.title || '',
			});
		}, [currentlyEdited]);

		useImperativeHandle(ref, () => innerRef.current!, []);

		return (
			<dialog ref={innerRef} className="w-[360px] rounded-sm p-8">
				<h2 className="mb-4 text-lg font-semibold">
					{currentlyEdited?.epic?.title ? 'Edit Epic' : 'Create Epic'}
				</h2>
				<form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
					<InputGroup
						label="Title"
						type="text"
						id="title"
						placeholder="Enter project title.."
						{...formik.getFieldProps('title')}
					/>
					<Button type="submit">Create Epic</Button>
				</form>
				<button onClick={() => innerRef.current?.close()}>X</button>
			</dialog>
		);
	},
);

export default SubmitEpicModal;
