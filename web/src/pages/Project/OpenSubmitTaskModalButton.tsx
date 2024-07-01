import Button from '@/components/Button';
import { useOpenSubmitTaskModal } from './contexts/OpenSubmitTaskModalContext';

export default function OpenSubmitTaskModalButton() {
	const { openSubmitTaskModal } = useOpenSubmitTaskModal();

	const handleClick = () => {
		openSubmitTaskModal();
	};

	return <Button onClick={handleClick}>Create a new task</Button>;
}
