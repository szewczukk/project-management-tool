import Button from '@/components/Button';
import { useOpenSubmitTaskModal } from './contexts/OpenSubmitTaskModalContext';
import { useOpenSubmitEpicModal } from './contexts/OpenSubmitEpicModalContext';

export default function ProjectControls() {
	const { openSubmitTaskModal } = useOpenSubmitTaskModal();
	const { openSubmitEpicModal } = useOpenSubmitEpicModal();

	const handleCreateNewTaskClick = () => {
		openSubmitTaskModal();
	};

	const handleCreateNewEpicClick = () => {
		openSubmitEpicModal();
	};

	return (
		<div className="flex items-center gap-2">
			<Button onClick={handleCreateNewTaskClick}>Create a new task</Button>
			<Button onClick={handleCreateNewEpicClick} variant="secondary">
				Create a new epic
			</Button>
		</div>
	);
}
