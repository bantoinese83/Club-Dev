import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: true,
})

export async function sendVerificationRequest({ identifier: email, url}: any) {
  const { host } = new URL(url)
  const result = await transporter.sendMail({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: `Verify your email on ${host}`,
    text: text({ url, host }),
    html: html({ url, host, email }),
  })

  const failed = result.rejected.concat(result.pending).filter(Boolean)
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
  }
}

// Email HTML body
const html = ({ url, host}: any) => {
  const buttonStyle = `
    background-color: #007bff;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
  `

  return `
    <div style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: white; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #007bff;">Welcome to ${host}!</h1>
        <p style="font-size: 16px; line-height: 1.5;">Please click the button below to verify your email address:</p>
        <a href="${url}" style="${buttonStyle}">Verify Email</a>
        <p style="font-size: 14px; color: #777; margin-top: 20px;">If you did not request this email, please ignore it.</p>
      </div>
    </div>
  `
}

// Email Text body (fallback for email clients that don't render HTML)
const text = ({ url, host }: any) => {
  return `Welcome to ${host}! Please click the link below to verify your email address: ${url}`
}

