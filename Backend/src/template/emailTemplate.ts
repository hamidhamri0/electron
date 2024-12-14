export function generateEmailTemplate(confirmLink: string) {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Confirm Your Email</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  </head>
  <body style="margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding: 20px 0;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #cccccc;">
            <tr>
              <td align="center" bgcolor="#f8f9fa" style="padding: 40px 0 30px 0;">
                <h1 style="color: #333333; font-family: Arial, sans-serif;">Confirm Your Email</h1>
              </td>
            </tr>
            <tr>
              <td bgcolor="#ffffff" style="padding: 40px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="color: #333333; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding: 20px 0 30px 0;">
                      Thank you for signing up! To complete your registration and activate your account, please confirm your email address by clicking the button below.
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" bgcolor="#007bff" style="border-radius: 4px;">
                            <a href="${confirmLink}" target="_blank" style="padding: 15px 25px; border-radius: 4px; color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; text-decoration: none; display: inline-block;">Confirm Email</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #333333; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; padding: 20px 0;">
                      If you didn't create an account with us, please ignore this email or contact our support team if you have any questions.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td bgcolor="#f8f9fa" style="padding: 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="color: #333333; font-family: Arial, sans-serif; font-size: 14px;">
                      &copy; Your Company 2023
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
    `;
}
