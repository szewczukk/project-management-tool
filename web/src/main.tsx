import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProjectPage from './pages/Project/ProjectPage';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LoginPage from './pages/Login/LoginPage';

const router = createBrowserRouter([
	{
		path: '/',
		Component: Dashboard,
	},
	{
		path: '/projects/:id',
		Component: ProjectPage,
	},
	{
		path: '/login',
		Component: LoginPage,
	},
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</React.StrictMode>,
);
