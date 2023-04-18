export abstract class UserPropsValitations {
    protected validateName(name: string): boolean {
        const regex = /^[a-zA-ZÀ-ú\s]+$/;

        return regex.test(name);
    }

    protected validateEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    protected validateTelephone(telephone: string): boolean {
        const numeroApenasNumeros = telephone.replace(/\D/g, "");

        return numeroApenasNumeros.length === 11;
    }

    protected validatePassword(password: string): boolean {
        const regexTamanho = /^.{8,}$/;
        const regexMaiuscula = /^(?=.*[A-Z])/;
        const regexNumero = /^(?=.*\d)/;
        const regexSequencia = /^(?!.*(.)\1{2,})/;

        return regexTamanho.test(password) &&
         regexMaiuscula.test(password) &&
         regexNumero.test(password) &&
         regexSequencia.test(password);
    }
}
