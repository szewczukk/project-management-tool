import { Link, useParams } from 'react-router-dom';
import Button from '@/components/Button';
import useProjectStore from '@/stores/project';
import { useMemo } from 'react';

export default function ProjectPage() {
	const { projects } = useProjectStore();
	const params = useParams<{ id: string }>();

	const project = useMemo(
		() => projects.find((p) => p.id === params.id),
		[projects, params],
	);

	if (!project) {
		return <h1>Not found</h1>;
	}

	return (
		<div className="container mt-8 p-8 bg-emerald-200 mx-auto">
			<h1>Project {project.name}</h1>
			<pre>{project.description}</pre>

			<Link to="/">
				<Button>Return to list</Button>
			</Link>
		</div>
	);
}
