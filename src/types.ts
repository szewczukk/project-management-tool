export type Project = {
	id: string;
	name: string;
	description: string;
};

export type User = {
	id: string;
	firstName: string;
	lastName: string;
};

export type UserStory = {
	id: string;
	name: string;
	description: string;
	priority: 'high' | 'medium' | 'low';
	creationDate: Date;
	status: 'todo' | 'doing' | 'done';
	projectId: Project['id'];
	creatorId: User['id'];
};

export type UserStoryDTO = Omit<UserStory, 'id'>;
