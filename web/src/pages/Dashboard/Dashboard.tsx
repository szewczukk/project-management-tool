import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import ProjectsList from './ProjectsList';
import { projectSchema } from '@/utils/types';
import styles from './styles.module.css';
import { useState } from 'react';

export default function Dashboard() {
	const { data, error, status } = useProjectsQuery();
	const [filter, setFilter] = useState('');

	if (status === 'pending') {
		return <p>Loading..</p>;
	}

	if (status === 'error') {
		return <p>Error {JSON.stringify(error)}</p>;
	}

	return (
		<div className="mx-auto mt-8 w-full max-w-[960px]">
			<div className="mb-4 w-full">
				<label className={styles.label}>
					<input
						type="text"
						placeholder="Search here.."
						className="w-full rounded-sm border border-slate-300 bg-slate-100 px-11 py-3 outline-offset-2"
						onChange={(e) => setFilter(e.target.value)}
					/>
				</label>
			</div>
			<ProjectsList filter={filter} projects={data} />
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
