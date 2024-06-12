import { Project } from '@/utils/types';

type Props = {
	projects: Project[];
};

export default function ProjectsList({ projects }: Props) {
	return (
		<ul>
			{projects.map((project) => (
				<li key={project.id}>
					<div className="w-full rounded-sm border border-slate-300 bg-slate-100 p-6">
						<h2 className="text-base font-semibold">{project.title}</h2>
						<p className="mt-3 text-sm">{project.description}</p>
					</div>
				</li>
			))}
		</ul>
	);
}
