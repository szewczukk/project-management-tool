import React from 'react';
import ReactDOM from 'react-dom/client';
import {
	BrowserRouter,
	Navigate,
	Outlet,
	Route,
	Routes,
} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProjectPage from './pages/Project/ProjectPage';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LoginPage from './pages/Login/LoginPage';
import { useCurrentUser } from './utils/hooks';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/" element={<PrivateRoute />}>
						<Route path="/" element={<Dashboard />} />
						<Route path="/projects/:id" element={<ProjectPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</React.StrictMode>,
);

function PrivateRoute() {
	const { data: currentUser, status } = useCurrentUser();
	if (!!currentUser && status !== 'success') {
		return <Navigate to="/login" />;
	}

	return <Outlet />;
}
