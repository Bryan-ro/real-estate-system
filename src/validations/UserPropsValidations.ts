export abstract class UserPropsValidations {
    protected validateName(name: string): void {
        const regex = /^[a-zA-ZÀ-ú\s]+$/;

        const test = regex.test(name);
        if (!test) throw new Error("Invalid name. The name cannot contain numbers or special characters.");
    }

    protected validateEmail(email: string): void {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const test = regex.test(email);

        if(!test) throw new Error("Invalid email address. Please provide a valid email address in the format example@example.com.");
    }

    protected validateTelephone(telephone: string): void {
        if(!telephone) throw new Error("Phone number is empty. Please provide a valid phone number with a minimum length of 10 digits.");
        const justNumbers = telephone.replace(/\D/g, "");
        const test = justNumbers.length === 10;
        if (!test) throw new Error("Invalid phone number. Please provide a valid phone number with a minimum length of 10 digits.");
    }

    protected validatePassword(password: string): void {
        const regexSize = /^.{8,}$/;
        const regexUppercase = /^(?=.*[A-Z])/;
        const regexNumber = /^(?=.*\d)/;
        const regexEquals = /^(?!.*([^\s])\1{2,})/;
        const regexSequence = /^(?!.*(.)\1{2,})(?!.*(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz))/i;


        const test = regexSize.test(password) && regexUppercase.test(password) && regexNumber.test(password) && regexEquals.test(password) && regexSequence.test(password);

        if(!test) throw new Error("Invalid password. Please provide a password that meets the following requirements: at least 8 characters, at least 1 uppercase letter, at least 1 digit, and no more than 3 consecutive characters that are letters or digits.");
    }
}
