import { ReactNode, createContext, useContext } from 'react';

const openSubmitTaskModalContext = createContext<(() => void) | undefined>(
	undefined,
);

type Props = {
	openSubmitTaskModal: () => void;
	children: ReactNode;
};

export default function OpenSubmitTaskModalContext({
	children,
	openSubmitTaskModal,
}: Props) {
	return (
		<openSubmitTaskModalContext.Provider value={openSubmitTaskModal}>
			{children}
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
