import {
    AccordionButton,
    AccordionItem,
    AccordionPanel,
} from "@chakra-ui/react";
import ChangePasswordForm from "./changePasswordForm";

const ChangePasswordItem = () => {
    return (
        <AccordionItem>
            <AccordionButton>change password</AccordionButton>
            <AccordionPanel>
                <ChangePasswordForm />
            </AccordionPanel>
        </AccordionItem>
    );
};

export default ChangePasswordItem;
