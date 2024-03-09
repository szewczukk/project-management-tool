import { Project } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProjectStore = {
	projects: Project[];

	addProject(name: string, description: string): void;
};

const useProjectStore = create<ProjectStore>()(
	persist(
		(set) => ({
			projects: [],

			addProject: (name, description) =>
				set((state) => ({
					projects: state.projects.concat([
						{ id: crypto.randomUUID(), name, description },
					]),
				})),
		}),
		{ name: 'projects-storage' },
	),
);

export default useProjectStore;
