import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import InputGroup from '@/components/InputGroup';
import Button from '@/components/Button';
import useProjectStore from '@/stores/project';

type FormValues = {
	name: string;
	description: string;
};

export default function ProjectListPage() {
	const { projects, addProject } = useProjectStore();
	const { register, handleSubmit, reset } = useForm<FormValues>();

	return (
		<div className="container mx-auto mt-8 flex flex-col gap-8">
			<form
				onSubmit={handleSubmit((values) => {
					addProject(values.name, values.description);
					reset();
				})}
				className="flex gap-4 items-end flex-grow"
			>
				<InputGroup
					inputProps={{
						id: 'name',
						type: 'text',
						...register('name', { required: true }),
					}}
					labelProps={{ htmlFor: 'name', children: 'Name' }}
				/>
				<InputGroup
					inputProps={{
						id: 'description',
						type: 'text',
						...register('description', { required: true }),
					}}
					labelProps={{ htmlFor: 'description', children: 'Description' }}
				/>

				<Button type="submit">Create a project</Button>
			</form>

			<div>
				<h2>Projects:</h2>
				<ul className="flex-grow">
					{projects.map((project) => (
						<li key={project.id}>
							<Link to={`/projects/${project.id}`}>{project.name}</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
