import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { User } from 'src/mongoose/schema/user.schema';

export async function sendEmail(
  emails: string[],
  title: string,
  tags: string[],
  author: User,
  postUrl?: string,
) {
  const transport: Mail = createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASS,
    },
  });
  return transport.sendMail({
    from: process.env.MAIL_AUTH_USER,
    to: emails.join(','),
    subject: 'Yours profile has been marks under new post',
    html: `<div>
    <p>Yours profile has been marks under new post with title: ${title}</p> 
    <p>You can find him use tags: ${tags.join(',')}</p> 
    <p>Post author: ${author.email || author.displayName}</p> 
    ${postUrl ? `<a>Post url: ${postUrl}</a>` : ``}
    </div>`,
  });
}
