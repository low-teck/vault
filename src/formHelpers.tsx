import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
	AuthFormItemProps,
	MotionButtonProps,
	SecureAuthFormItemProps,
} from "./types";

const ButtonWMotion = motion(Button);

export const MotionButton = ({
	type,
	label,
	loading,
	colorScheme,
	variant = "ghost",
	onClick,
	isDisabled = false,
}: MotionButtonProps) => {
	return (
		<ButtonWMotion
			whileHover={{ scale: 1.1 }}
			colorScheme={colorScheme}
			variant={variant}
			isDisabled={isDisabled}
			isLoading={loading}
			fontFamily="Hachi Maru Pop"
			whileTap={{ scale: 0.9 }}
			type={type}
			onClick={onClick}
		>
			{label}
		</ButtonWMotion>
	);
};

export const FormItem = ({
	isRequired = true,
	label,
	placeholder,
	value,
	onChange,
	error,
	touched,
	variant = "filled",
}: AuthFormItemProps) => {
	return (
		<FormControl isRequired={isRequired}>
			<FormLabel>{label}</FormLabel>
			<InputGroup>
				<Input
					onChange={onChange}
					value={value}
					placeholder={placeholder}
					focusBorderColor="cyan.300"
					variant={variant}
				/>
			</InputGroup>
			<Box h="1vh" textColor="palevioletred">
				{error && touched ? error : null}
			</Box>
		</FormControl>
	);
};

export const SecureFormItem = ({
	isRequired = true,
	label,
	toggle,
	show,
	value,
	onChange,
	error,
	touched,
	placeholder,
}: SecureAuthFormItemProps) => {
	return (
		<FormControl isRequired={isRequired}>
			<FormLabel>{label}</FormLabel>
			<InputGroup>
				<Input
					onChange={onChange}
					value={value}
					variant="filled"
					type={show ? "text" : "password"}
					focusBorderColor="cyan.300"
					placeholder={placeholder}
				/>
				<InputRightElement width="4.5rem">
					<Button h="1.75rem" size="sm" onClick={toggle}>
						{show ? "Hide" : "Show"}
					</Button>
				</InputRightElement>
			</InputGroup>
			<Box h="1vh" textColor="palevioletred">
				{error && touched ? error : null}
			</Box>
		</FormControl>
	);
};
