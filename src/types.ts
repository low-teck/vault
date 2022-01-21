export interface FormItemBase {
	isRequired?: boolean;
	label: string;
	placeholder: string;
	value: string;
	onChange: React.ChangeEventHandler;
	variant?: "filled" | "ghost" | "outline" | "solid";
}

export interface AuthFormItemProps extends FormItemBase {
	error: string | undefined;
	touched: boolean | undefined;
}

export interface SecureAuthFormItemProps extends AuthFormItemProps {
	show: boolean;
	toggle: React.MouseEventHandler;
}

export interface MotionButtonProps {
	type?: "submit";
	variant?: "solid" | "ghost" | "outline" | "link";
	label: string;
	loading?: boolean;
	colorScheme: string;
	isDisabled?: boolean;
	onClick?: React.MouseEventHandler;
}

export interface SecureAuthFormItemProps extends AuthFormItemProps {
	show: boolean;
	toggle: React.MouseEventHandler;
}

type Video = "mp4" | "mpeg" | "wmv";
type Image = "jpg" | "jpeg" | "png";
type Document = "pdf" | "zip";
type Ppt = "pptx" | "odp" | "ppt" | "key";

export interface FileInfo {
	filename: string;
	saved: boolean;
	date: Date;
	lastModifiedDate: Date;
	path: string;
	type: Video | Image | Document | Ppt;
}
