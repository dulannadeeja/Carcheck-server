import * as nodemailer from "nodemailer";

export type TransporterProps = {
    host: string;
    service: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
}

export const createTransporter = ({ host, service, port, secure, user, pass }: TransporterProps) => {
    return nodemailer.createTransport({
        host, service, port, secure,
        auth: {
            user,
            pass
        }
    });
}