import { Project } from '@/utils/types';
import { Link } from 'react-router-dom';

type Props = {
	filter: string;
	projects: Project[];
};

export default function ProjectsList({ filter, projects }: Props) {
	const filteredProjects = projects.filter((project) =>
		project.title.toLocaleLowerCase().startsWith(filter.toLocaleLowerCase()),
	);

	return (
		<ul className="flex flex-col gap-4">
			{filteredProjects.map((project) => (
				<li key={project.id}>
					<div className="w-full rounded-sm border border-slate-300 bg-slate-100 p-6">
						<h2 className="text-base font-semibold">
							<Link to={`/projects/${project.id}`}>{project.title}</Link>
						</h2>
						<p className="mt-3 text-sm">{project.description}</p>
					</div>
				</li>
			))}
		</ul>
	);
}
