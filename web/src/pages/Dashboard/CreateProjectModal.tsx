import InputGroup from '@/components/InputGroup';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { CreateProjectData } from './queries';

type Props = {
	onCreateProject: (data: CreateProjectData) => void;
};

export default forwardRef<HTMLDialogElement, Props>(function CreateProjectModal(
	{ onCreateProject },
	ref,
) {
	const innerRef = useRef<HTMLDialogElement>(null);

	useImperativeHandle(ref, () => innerRef.current!, []);

	return (
		<dialog ref={innerRef} className="w-[360px] rounded-sm p-8">
			<h2 className="mb-4 text-lg font-semibold">Create Project</h2>
			<div className="flex flex-col gap-4">
				<InputGroup
					label="Title"
					type="text"
					id="title"
					placeholder="Enter project title.."
				/>
				<InputGroup
					label="Description"
					id="description"
					placeholder="Enter project description.."
					isTextArea
				/>
				<button
					className="rounded-sm bg-[#651E3E] py-2 text-white outline-offset-2 hover:bg-[#511832]"
					onClick={() =>
						onCreateProject({ project: { description: 'aa', title: 'aa' } })
					}
				>
					Create Project
				</button>
			</div>
			<button onClick={() => innerRef.current?.close()}>X</button>
		</dialog>
	);
});
