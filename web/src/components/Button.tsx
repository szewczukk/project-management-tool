import { ButtonHTMLAttributes, forwardRef } from 'react';

type Props = {
	variant?: 'primary' | 'secondary';
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default forwardRef<HTMLButtonElement, Props>(function Button(
	{ className, variant = 'primary', ...rest },
	ref,
) {
	if (variant === 'secondary') {
		return (
			<button
				className={`rounded-sm border border-[#651E3E] bg-slate-100 px-6 py-2 text-[#651E3E] outline-offset-2 hover:bg-slate-200 ${className}`}
				ref={ref}
				{...rest}
			/>
		);
	}

	return (
		<button
			className={`rounded-sm border border-transparent bg-[#651E3E] px-6 py-2 text-white outline-offset-2 hover:bg-[#511832] ${className}`}
			ref={ref}
			{...rest}
		/>
	);
});
