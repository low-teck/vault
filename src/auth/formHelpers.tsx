import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { AuthFormItemProps, MotionButtonProps } from "../types";

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
