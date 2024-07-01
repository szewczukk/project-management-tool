import { Epic, Task } from '@/utils/types';
import { ReactNode, createContext, useContext, useState } from 'react';

type CurrentlyEdited =
	| {
			task: Task;
			epic: Epic | undefined;
	  }
	| undefined;

type OpenSubmitTaskModalContext =
	| {
			openSubmitTaskModal: (currentlyEdited?: CurrentlyEdited) => void;
			currentlyEdited: CurrentlyEdited | undefined;
	  }
	| undefined;

const openSubmitTaskModalContext =
	createContext<OpenSubmitTaskModalContext>(undefined);

type Props = {
	openSubmitTaskModal: () => void;
	children: ReactNode;
};

export default function OpenSubmitTaskModalContext(props: Props) {
	const [currentlyEdited, setCurrentlyEdited] = useState<CurrentlyEdited>();

	const handleOpenSubmitTaskModal = (currentlyEdited: CurrentlyEdited) => {
		setCurrentlyEdited(currentlyEdited);
		props.openSubmitTaskModal();
	};

	return (
		<openSubmitTaskModalContext.Provider
			value={{
				currentlyEdited,
				openSubmitTaskModal: handleOpenSubmitTaskModal,
			}}
		>
			{props.children}
		</openSubmitTaskModalContext.Provider>
	);
}

export function useOpenSubmitTaskModal() {
	const context = useContext(openSubmitTaskModalContext);
	if (context === undefined) {
		throw new Error('Must be a child of <OpenSubmitTaskModalContext />!');
	}

	return context;
}
