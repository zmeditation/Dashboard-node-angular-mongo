const nodemailer = require( 'nodemailer' );


module.exports = (email, password) => {

// config for mailserver and mail, input your data
  const config = {
    mailserver: {
      // service: 'Godaddy',
      host: "smtpout.secureserver.net",  
      secure: true,
      secureConnection: false,
      tls: {
          ciphers:'SSLv3'
      },
      requireTLS:true,
      port: 465,
      debug: true,
      auth: {
        user: 'publisher@adwmg.com',
        pass: '9TBjTv5qELftd'
      }
    },
    mail: {
      from: 'publisher@adwmg.com',
      to: `${email}`,
      subject: 'WMG international',
      text: `You changed your password to a new one`,
      html: `
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body>

        <h1 style="color:#2f4460;" > Forgot your password? It happens to the best of us. </h1>
        <h2 style="color:#2f4460;" >
        Your new Dashboard password is -
        <span style="border-bottom: 1px solid #2f4460; padding-bottom: 3px;" > ${password}</span> 
        </h2>
        <img src="cid:unique@kreata.ee" style="width: 7rem;" />

        </body>
      </html>`,

      attachments: [{
        filename: 'WMGlogo.png',
        path: __dirname + '/WMGlogo.png',
        cid: 'unique@kreata.ee' 
      }]
    }
  };
    
    
  const sendMail = async ({ mailserver, mail }) => {
  
    // create a nodemailer transporter using smtp
    let transporter = nodemailer.createTransport( mailserver );
    
    // send mail using transporter
    await transporter.sendMail( mail );
    
    return { success: true };
  };
  
  return sendMail(config)
    .catch(err => ({ success: false }));
}


