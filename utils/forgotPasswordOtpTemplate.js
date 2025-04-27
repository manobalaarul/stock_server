const forgotPasswordOtpTemplate = ({ name, otp }) => {
  return `
       <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); text-align: center;">
    <h2 style="background: #007bff; color: white; padding: 15px; border-radius: 10px 10px 0 0;">OTP Verification</h2>
    <p>Hello <b>${name}</b>,</p>
    <p>Use the OTP below to verify your account. This OTP is valid for <b>10 minutes</b>.</p>
    <div style="font-size: 24px; font-weight: bold; background: #007bff; color: white; padding: 15px; border-radius: 5px; display: inline-block; margin: 20px auto;">
      ${otp}
    </div>
    <p>If you didn't request this, please ignore this email.</p>
    <p style="margin-top: 20px; font-size: 14px; color: #777;">&copy; 2025 Stock Management | All Rights Reserved</p>
  </div>
    `;
};

export default forgotPasswordOtpTemplate;
