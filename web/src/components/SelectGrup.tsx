import { SelectHTMLAttributes } from 'react';

type Props = {
	label: string;
	options: { key: string | number; title: string }[];
} & SelectHTMLAttributes<HTMLSelectElement>;

export default function SelectGroup(props: Props) {
	return (
		<div className="flex flex-col gap-1">
			<label htmlFor={props.id} className="text-sm text-gray-900">
				{props.label}
			</label>
			<select
				id={props.id}
				className={`w-full rounded-sm border border-slate-300 bg-slate-100 px-4 py-2 outline-offset-2 hover:bg-[#edf2f6] ${props.className}`}
				{...props}
			>
				{props.options.map((option) => (
					<option key={option.key} value={option.key}>
						{option.title}
					</option>
				))}
			</select>
		</div>
	);
}
