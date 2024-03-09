import { useState } from 'react';
import InputGroup from './InputGroup';
import Button from './Button';

type Props = {
	value: string;
	label: string;
	onChange: (newValue: string) => void;
};

export default function EditableText(props: Props) {
	const [value, setValue] = useState(props.value);
	const [isEditing, setIsEditing] = useState(false);

	if (!isEditing) {
		return (
			<div className="flex items-center gap-4 w-full">
				<p>{value}</p>
				<Button onClick={() => setIsEditing(true)}>Edit</Button>
			</div>
		);
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				props.onChange(value);
				setIsEditing(false);
			}}
			className="flex items-center gap-4 w-full"
		>
			<InputGroup
				inputProps={{
					id: 'value',
					value,
					onChange: (e) => {
						setValue(e.target.value);
					},
				}}
				labelProps={{ children: props.label }}
			/>
			<Button type="submit">Save</Button>
		</form>
	);
}
