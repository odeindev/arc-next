// @lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const isDevelopment = process.env.NODE_ENV === 'development';
const DEV_EMAIL = 'odeindev@gmail.com';

// Генерация 6-значного кода подтверждения
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Отправка email с кодом подтверждения через Resend
export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  try {
    // В режиме разработки используем верифицированный email или пропускаем отправку
    if (isDevelopment) {
      console.log(`[DEV MODE] Verification code for ${email}: ${code}`);
      
      if (email !== DEV_EMAIL) {
        return; // В разработке пропускаем отправку на неверифицированные адреса
      }
    }

    const { error } = await resend.emails.send({
      from: "Verification <onboarding@resend.dev>",
      to: isDevelopment ? DEV_EMAIL : email, // В режиме разработки отправляем только на DEV_EMAIL
      subject: 'Подтверждение регистрации',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Подтверждение регистрации</h2>
          <p>Благодарим вас за регистрацию! Для завершения процесса регистрации, пожалуйста, введите следующий код:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; padding: 10px 15px; background-color: #f5f5f5; border-radius: 5px;">${code}</span>
          </div>
          <p>Код действителен в течение 30 минут.</p>
          <p>Если вы не запрашивали этот код, пожалуйста, проигнорируйте это письмо.</p>
          ${isDevelopment && email !== DEV_EMAIL ? `<p><strong>DEV MODE:</strong> Этот email предназначался для: ${email}</p>` : ''}
        </div>
      `,
    });

    if (error) {
      console.error('Ошибка отправки email:', error);
      
      if (isDevelopment) {
        // В режиме разработки не бросаем ошибку, чтобы не блокировать процесс
        console.log(`[DEV MODE] Симуляция отправки кода: ${code} на email: ${email}`);
        return;
      }
      
      throw new Error('Не удалось отправить email с кодом подтверждения');
    }
  } catch (error) {
    console.error('Ошибка при отправке email:', error);
    
    if (isDevelopment) {
      // В режиме разработки не бросаем ошибку
      console.log(`[DEV MODE] Симуляция отправки кода: ${code} на email: ${email}`);
      return;
    }
    
    throw new Error('Не удалось отправить email с кодом подтверждения');
  }
}