import Button from '@/components/Button';
import InputGroup from '@/components/InputGroup';
import api from '@/utils/api';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { z } from 'zod';

type Credentials = {
	username: string;
	password: string;
};

export default function LoginPage() {
	const { mutate } = useMutation({
		mutationFn: async (credentials: Credentials) => {
			const response = await api.post('/signin', { credentials });
			const data = response.data.data;

			return data;
		},
		onSuccess(data) {
			const { token } = z.object({ token: z.string() }).parse(data);
			localStorage.setItem('token', token);
		},
	});
	const formik = useFormik<Credentials>({
		initialValues: { username: '', password: '' },
		onSubmit: (values) => mutate(values),
	});

	return (
		<div className="flex h-screen w-full items-center justify-center bg-slate-300">
			<form
				className="flex flex-col gap-4 bg-slate-50 p-16"
				onSubmit={formik.handleSubmit}
			>
				<InputGroup
					label="Username"
					placeholder="Enter your username.."
					required
					{...formik.getFieldProps('username')}
				/>
				<InputGroup
					label="Password"
					placeholder="Enter your password.."
					type="password"
					required
					{...formik.getFieldProps('password')}
				/>

				<Button variant="primary" type="submit">
					Sign in
				</Button>
			</form>
		</div>
	);
}
