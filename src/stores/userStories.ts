import { UserStory, UserStoryDTO } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProjectStore = {
	userStories: UserStory[];

	addUserStory: (dto: UserStoryDTO) => void;
	deleteUserStory: (id: string) => void;
};

const useUserStoriesStore = create<ProjectStore>()(
	persist(
		(set) => ({
			userStories: [],

			addUserStory: (dto: UserStoryDTO) =>
				set((state) => ({
					userStories: state.userStories.concat([
						{ id: crypto.randomUUID(), ...dto },
					]),
				})),
			deleteUserStory: (id: string) =>
				set((state) => ({
					userStories: state.userStories.filter((p) => p.id !== id),
				})),
		}),
		{ name: 'user-stories-storage' },
	),
);

export default useUserStoriesStore;
