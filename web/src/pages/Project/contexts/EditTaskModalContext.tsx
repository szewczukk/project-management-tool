import { Epic, Task } from '@/utils/types';
import {
	ReactNode,
	SetStateAction,
	createContext,
	useContext,
	useState,
} from 'react';

type CurrentlyEditedTask = {
	task: Task | undefined;
	epic: Epic | undefined;
};

type EditTaskModalValues =
	| {
			currentlyEditedTask: CurrentlyEditedTask;
			setCurrentlyEditedTask: React.Dispatch<
				SetStateAction<CurrentlyEditedTask>
			>;
	  }
	| undefined;

const editTaskModalContext = createContext<EditTaskModalValues>(undefined);

type Props = {
	children: ReactNode;
};

export default function EditTaskModalContextProvider({ children }: Props) {
	const [values, setValues] = useState<CurrentlyEditedTask>({
		epic: undefined,
		task: undefined,
	});

	return (
		<editTaskModalContext.Provider
			value={{ currentlyEditedTask: values, setCurrentlyEditedTask: setValues }}
		>
			{children}
		</editTaskModalContext.Provider>
	);
}

export function useEditTaskModal() {
	const context = useContext(editTaskModalContext);
	if (context === undefined) {
		throw new Error('Must be a child of <EditTaskModalContextProvider />!');
	}

	return context;
}
