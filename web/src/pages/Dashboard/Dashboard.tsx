import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import ProjectsList from './ProjectsList';
import { projectSchema } from '@/utils/types';
import styles from './styles.module.css';
import { useRef, useState } from 'react';
import InputGroup from '@/components/InputGroup';

export default function Dashboard() {
	const { data, error, status } = useProjectsQuery();
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [filter, setFilter] = useState('');

	const onCreateProjectClick = () => {
		dialogRef.current?.showModal();
	};

	const onCloseCreateProjectModal = () => {
		dialogRef.current?.close();
	};

	if (status === 'pending') {
		return <p>Loading..</p>;
	}

	if (status === 'error') {
		return <p>Error {JSON.stringify(error)}</p>;
	}

	return (
		<div className="mx-auto mt-8 w-full max-w-[960px]">
			<h1 className="mb-4 text-xl font-semibold">Projects</h1>
			<div className="mb-4 flex w-full gap-4">
				<label className={styles.label}>
					<input
						type="text"
						placeholder="Search here.."
						className="w-full rounded-sm border border-slate-300 bg-slate-100 px-11 py-3 outline-offset-2 hover:bg-[#edf2f6]"
						onChange={(e) => setFilter(e.target.value)}
					/>
				</label>
				<button
					className="flex-shrink-0 rounded-sm bg-[#651E3E] px-6 text-white outline-offset-2 hover:bg-[#511832]"
					onClick={onCreateProjectClick}
				>
					Create Project
				</button>
			</div>
			<ProjectsList filter={filter} projects={data} />
			<dialog ref={dialogRef} className="w-[360px] rounded-sm p-8">
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
						id="title"
						placeholder="Enter project description.."
						isTextArea
					/>
					<button className="rounded-sm bg-[#651E3E] py-2 text-white outline-offset-2 hover:bg-[#511832]">
						Create Project
					</button>
				</div>
				<button onClick={onCloseCreateProjectModal}>X</button>
			</dialog>
		</div>
	);
}

const schema = z.object({
	data: z.array(projectSchema),
});

function useProjectsQuery() {
	return useQuery({
		queryKey: ['projects'],
		queryFn: async () => {
			const response = await fetch('http://localhost:4000/api/projects');
			const result = await response.json();

			const projects = schema.parse(result).data;
			return projects;
		},
	});
}
