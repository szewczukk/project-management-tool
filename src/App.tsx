import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Project } from './types';

type FormValues = {
	name: string;
	description: string;
};

export default function App() {
	const [projects, setProjects] = useState<Project[]>([]);
	const { register, handleSubmit } = useForm<FormValues>();

	const createProject = (name: string, description: string) => {
		setProjects((prev) =>
			prev.concat([{ id: crypto.randomUUID(), name, description }]),
		);
	};

	return (
		<div className="container mx-auto p-8 bg-slate-300">
			<h1 className="text-red-500">Hello, world!</h1>

			<ul>
				{projects.map((project) => (
					<li key={project.id}>{project.name}</li>
				))}
			</ul>

			<form
				onSubmit={handleSubmit((values) =>
					createProject(values.name, values.description),
				)}
				className="flex flex-col gap-4 items-start"
			>
				<input type="text" {...register('name', { required: true })} />
				<input type="text" {...register('description', { required: true })} />

				<input type="submit" value="Create a project" />
			</form>
		</div>
	);
}
