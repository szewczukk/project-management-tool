import {
	createBrowserRouter,
	RouterProvider as ReactRouterProvider,
} from 'react-router-dom';
import ProjectListPage from './pages/ProjectListPage';
import ProjectPage from './pages/ProjectPage';

const router = createBrowserRouter([
	{
		path: '/',
		Component: ProjectListPage,
	},
	{
		path: '/projects/:id',
		Component: ProjectPage,
	},
]);

export default function RouterProvider() {
	return <ReactRouterProvider router={router} />;
}
