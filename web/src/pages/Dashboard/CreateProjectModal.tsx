import InputGroup from '@/components/InputGroup';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { CreateProjectData } from './queries';
import { useFormik } from 'formik';

type Props = {
	onCreateProject: (data: CreateProjectData) => void;
};

export default forwardRef<HTMLDialogElement, Props>(function CreateProjectModal(
	{ onCreateProject },
	ref,
) {
	const innerRef = useRef<HTMLDialogElement>(null);
	const formik = useFormik({
		initialValues: { title: '', description: '' },
		onSubmit: (values) => onCreateProject({ project: values }),
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
				<InputGroup
					label="Description"
					id="description"
					placeholder="Enter project description.."
					isTextArea
					onChange={formik.handleChange}
					value={formik.values.description}
				/>
				<button
					className="rounded-sm bg-[#651E3E] py-2 text-white outline-offset-2 hover:bg-[#511832]"
					type="submit"
				>
					Create Project
				</button>
			</form>
			<button onClick={() => innerRef.current?.close()}>X</button>
		</dialog>
	);
});
