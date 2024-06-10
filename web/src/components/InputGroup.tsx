import { InputHTMLAttributes, LabelHTMLAttributes } from 'react';

type Props = {
	inputProps: InputHTMLAttributes<HTMLInputElement>;
	labelProps: LabelHTMLAttributes<HTMLLabelElement>;
};

export default function InputGroup({ inputProps, labelProps }: Props) {
	return (
		<div className="flex flex-col gap-2">
			<label
				className=""
				{...labelProps}
			>
				{labelProps.children}
			</label>
			<input
				className="border rounded-sm px-2 py-1"
				{...inputProps}
			/>
		</div>
	);
}
