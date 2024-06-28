import { ButtonHTMLAttributes, forwardRef } from 'react';

export default forwardRef<
	HTMLButtonElement,
	ButtonHTMLAttributes<HTMLButtonElement>
>(function Button({ className, ...rest }, ref) {
	return (
		<button
			className={`rounded-sm bg-[#651E3E] px-6 py-2 text-white outline-offset-2 hover:bg-[#511832] ${className}`}
			ref={ref}
			{...rest}
		/>
	);
});
