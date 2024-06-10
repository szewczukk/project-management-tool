import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, ...props }: Props) {
	return (
		<button
			className={`px-4 py-1 bg-slate-300 rounded-sm hover:bg-slate-400 ${className}`}
			{...props}
		/>
	);
}
