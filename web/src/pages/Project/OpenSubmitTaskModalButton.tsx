import Button from '@/components/Button';
import { useEditTaskModal } from './contexts/EditTaskModalContext';
import { useOpenSubmitTaskModal } from './contexts/OpenSubmitTaskModalContext';

export default function OpenSubmitTaskModalButton() {
	const { setCurrentlyEditedTask } = useEditTaskModal();
	const openSubmitTaskModal = useOpenSubmitTaskModal();

	const handleClick = () => {
		setCurrentlyEditedTask({ epic: undefined, task: undefined });
		openSubmitTaskModal();
	};

	return <Button onClick={handleClick}>Create a new task</Button>;
}
