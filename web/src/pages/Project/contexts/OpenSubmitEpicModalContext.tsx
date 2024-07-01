import { Epic } from '@/utils/types';
import { ReactNode, createContext, useContext, useState } from 'react';

type CurrentlyEdited =
	| {
			epic?: Epic;
			projectId: number;
	  }
	| undefined;

type OpenSubmitEpicModalContext =
	| {
			openSubmitEpicModal: (currentlyEdited?: CurrentlyEdited) => void;
			currentlyEdited: CurrentlyEdited | undefined;
	  }
	| undefined;

const openSubmitEpicModalContext =
	createContext<OpenSubmitEpicModalContext>(undefined);

type Props = {
	openSubmitEpicModal: () => void;
	children: ReactNode;
};

export default function OpenSubmitEpicModalContext(props: Props) {
	const [currentlyEdited, setCurrentlyEdited] = useState<CurrentlyEdited>();

	const handleOpenSubmitTaskModal = (currentlyEdited: CurrentlyEdited) => {
		setCurrentlyEdited(currentlyEdited);
		props.openSubmitEpicModal();
	};

	return (
		<openSubmitEpicModalContext.Provider
			value={{
				currentlyEdited,
				openSubmitEpicModal: handleOpenSubmitTaskModal,
			}}
		>
			{props.children}
		</openSubmitEpicModalContext.Provider>
	);
}

export function useOpenSubmitEpicModal() {
	const context = useContext(openSubmitEpicModalContext);
	if (context === undefined) {
		throw new Error('Must be a child of <OpenSubmitEpicModalContext />!');
	}

	return context;
}
