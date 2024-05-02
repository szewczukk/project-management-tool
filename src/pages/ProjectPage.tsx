import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/Button';
import useProjectStore from '@/stores/project';
import { useMemo } from 'react';
import EditableText from '@/components/EditableText';
import InputGroup from '@/components/InputGroup';
import { useForm } from 'react-hook-form';
import useUserStoriesStore from '@/stores/userStories';

type CreateUserStoryFormValues = {
	name: string;
	description: string;
	priority: 'high' | 'medium' | 'low';
};

export default function ProjectPage() {
	const { projects, deleteProject, changeName, changeDescription } =
		useProjectStore();
	const { addUserStory, userStories } = useUserStoriesStore();
	const navigate = useNavigate();
	const { handleSubmit, register } = useForm<CreateUserStoryFormValues>();
	const params = useParams<{ id: string }>();

	const project = useMemo(
		() => projects.find((p) => p.id === params.id),
		[projects, params],
	);

	const projectsUserStories = useMemo(
		() => userStories.filter((story) => story.projectId === project?.id),
		[userStories, project],
	);

	if (!project) {
		return <h1>Not found</h1>;
	}

	return (
		<div className="container mx-auto mt-8 flex flex-col gap-8 items-start">
			<div className="flex items-end gap-8">
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
			<div className="flex flex-col gap-4">
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
			</div>
			<form
				className="flex flex-col gap-2"
				onSubmit={handleSubmit(
					(values) =>
						addUserStory({
							name: values.name,
							description: values.description,
							priority: values.priority,
							creationDate: new Date(),
							status: 'todo',
							creatorId: '1',
							projectId: project.id,
						}),
					(err) => console.error(err),
				)}
			>
				<InputGroup
					inputProps={{ type: 'text', id: 'name', ...register('name') }}
					labelProps={{ children: 'Name', htmlFor: 'name' }}
				/>
				<InputGroup
					inputProps={{
						type: 'text',
						id: 'description',
						...register('description'),
					}}
					labelProps={{ children: 'Description', htmlFor: 'description' }}
				/>
				<label htmlFor="priority">Priority</label>
				<select
					id="priority"
					className="px-3 py-1 rounded-sm bg-slate-300"
					{...register('priority')}
				>
					<option value="high">High</option>
					<option value="medium">Medium</option>
					<option value="low">Low</option>
				</select>
				<button type="submit" className="px-3 py-1 bg-slate-300 rounded-sm">
					Create
				</button>
			</form>
			<div>
				<h2>User stories</h2>
				<ul>
					{projectsUserStories.map((story) => (
						<li key={story.id}>{story.name}</li>
					))}
				</ul>
			</div>
		</div>
	);
}
