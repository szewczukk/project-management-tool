import { Project } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProjectStore = {
	projects: Project[];

	addProject: (name: string, description: string) => void;
	deleteProject: (id: string) => void;
	changeName: (id: string, name: string) => void;
	changeDescription: (id: string, description: string) => void;
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
			deleteProject: (id: string) =>
				set((state) => ({
					projects: state.projects.filter((p) => p.id !== id),
				})),

			changeName: (id: string, name: string) =>
				set((state) => ({
					projects: state.projects.map((p) => {
						if (p.id !== id) {
							return p;
						}

						return { id, name, description: p.description };
					}),
				})),

			changeDescription: (id: string, description: string) =>
				set((state) => ({
					projects: state.projects.map((p) => {
						if (p.id !== id) {
							return p;
						}

						return { id, name: p.name, description };
					}),
				})),
		}),
		{ name: 'projects-storage' },
	),
);

export default useProjectStore;
