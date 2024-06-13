import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type Props = { label: string } & (
	| ({
			isTextArea?: false;
	  } & InputHTMLAttributes<HTMLInputElement>)
	| ({ isTextArea: true } & TextareaHTMLAttributes<HTMLTextAreaElement>)
);

export default function InputGroup(props: Props) {
	return (
		<div className="flex flex-col gap-1">
			<label htmlFor={props.id} className="text-sm text-gray-900">
				{props.label}
			</label>
			{!props.isTextArea ? (
				<input
					id={props.id}
					className={`w-full rounded-sm border border-slate-300 bg-slate-100 px-4 py-2 outline-offset-2 hover:bg-[#edf2f6] ${props.className}`}
					{...props}
				/>
			) : (
				<textarea
					id={props.id}
					className={`h-32 w-full resize-none rounded-sm border border-slate-300 bg-slate-100 px-4 py-2 outline-offset-2 hover:bg-[#edf2f6] ${props.className}`}
					{...props}
				/>
			)}
		</div>
	);
}
