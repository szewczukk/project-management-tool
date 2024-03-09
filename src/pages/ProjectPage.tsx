import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button';

export default function ProjectPage() {
	const params = useParams<{ id: string }>();

	return (
		<div className="container mt-8 p-8 bg-emerald-200 mx-auto">
			<h1>Project #{params.id}</h1>

			<Link to="/">
				<Button>Return to list</Button>
			</Link>
		</div>
	);
}
