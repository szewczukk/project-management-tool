import {
	createBrowserRouter,
	RouterProvider as ReactRouterProvider,
} from 'react-router-dom';
import ProjectListPage from './pages/ProjectListPage';

const router = createBrowserRouter([
	{
		path: '/',
		Component: ProjectListPage,
	},
]);

export default function RouterProvider() {
	return <ReactRouterProvider router={router} />;
}
