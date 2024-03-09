import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/Button';
import useProjectStore from '@/stores/project';
import { useMemo } from 'react';
import EditableText from '@/components/EditableText';

export default function ProjectPage() {
	const { projects, deleteProject, changeName, changeDescription } =
		useProjectStore();
	const navigate = useNavigate();
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
			<EditableText
				value={project.name}
				onChange={(newName) => changeName(project.id, newName)}
				label="Name"
			/>
			<EditableText
				value={project.description}
				onChange={(newDescription) =>
					changeDescription(project.id, newDescription)
				}
				label="Description"
			/>

			<Link to="/">
				<Button>Return to list</Button>
			</Link>

			<Button
				onClick={() => {
					deleteProject(project.id);
					navigate('/');
				}}
				className="bg-red-500 hover:bg-red-600"
			>
				Delete
			</Button>
		</div>
	);
}
