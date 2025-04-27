const verifyEmailTemplate = ({ name, url }) => {
  return `
        <div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
      <h2 style="background: #007bff; color: white; padding: 15px; border-radius: 10px 10px 0 0;">Verify Your Email</h2>
      <p>Hello <b>${name}</b>,</p>
      <p>Thank you for signing up. Please verify your email by clicking the button below.</p>
      <a href="${url}" style="background: #007bff; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block; margin-top: 20px;">Verify Email</a>
      <p>If you did not sign up, you can ignore this email.</p>
      <p style="margin-top: 20px; font-size: 14px; color: #777;">&copy; 2025 Stock Management | All Rights Reserved</p>
    </div>
    `;
};

export default verifyEmailTemplate;
