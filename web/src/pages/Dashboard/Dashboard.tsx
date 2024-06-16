import ProjectsList from './ProjectsList';
import styles from './styles.module.css';
import { useRef, useState } from 'react';
import { useCreateProjectMutation, useProjectsQuery } from './queries';
import CreateProjectModal from './CreateProjectModal';

export default function Dashboard() {
	const { data, error, status } = useProjectsQuery();
	const createProjectMutation = useCreateProjectMutation();
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [filter, setFilter] = useState('');

	const onCreateProjectClick = () => {
		dialogRef.current?.showModal();
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
			<CreateProjectModal
				onCreateProject={(data) => console.log(data)}
				ref={dialogRef}
			/>
		</div>
	);
}
