import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Project } from '@/types';
import InputGroup from '@/components/InputGroup';
import Button from '@/components/Button';

type FormValues = {
	name: string;
	description: string;
};

export default function ProjectListPage() {
	const [projects, setProjects] = useState<Project[]>([]);
	const { register, handleSubmit, reset } = useForm<FormValues>();

	const createProject = (name: string, description: string) => {
		setProjects((prev) =>
			prev.concat([{ id: crypto.randomUUID(), name, description }]),
		);
	};

	return (
		<div className="container mx-auto p-8 mt-8 bg-emerald-200">
			<ul>
				{projects.map((project) => (
					<li key={project.id}>
						<Link to={`/projects/${project.id}`}>{project.name}</Link>
					</li>
				))}
			</ul>

			<form
				onSubmit={handleSubmit((values) => {
					createProject(values.name, values.description);
					reset();
				})}
				className="flex flex-col gap-4 items-start"
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
		</div>
	);
}
