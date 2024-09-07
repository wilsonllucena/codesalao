import nodemailer from 'nodemailer';
import os from 'os';

// Função para enviar e-mail
async function sendEmail(to: string) {
    // Configuração do transportador
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'wilsonllucena@gmail.com',
            pass: 'dev261456123'
        }
    });

    // Obter endereço do sistema
    const systemAddress = os.hostname();

    // Template de e-mail
    const emailTemplate = `
        <h1>Bem-vindo!</h1>
        <p>Você recebeu este e-mail do sistema: ${systemAddress}</p>
        <a href="http://example.com" style="padding: 10px 20px; background-color: blue; color: white; text-decoration: none;">Clique aqui</a>
    `;

    // Opções do e-mail
    let mailOptions = {
        from: 'wilsonllucena@gmail.com',
        to: to,
        subject: 'Bem-vindo!',
        html: emailTemplate
    };

    // Enviar e-mail
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado: ' + info.response);
    } catch (error) {
        console.error('Erro ao enviar e-mail: ' + error);
    }
}

// Exemplo de uso
sendEmail('destinatario@example.com');