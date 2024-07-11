import { useQuery } from '@tanstack/react-query';
import api from './api';
import { z } from 'zod';

export function useCurrentUser() {
	return useQuery({
		queryKey: ['me'],
		queryFn: async () => {
			const response = await api.get('/me');

			return z
				.object({
					id: z.number(),
					username: z.string(),
				})
				.parse(response.data.data);
		},
	});
}
