const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEventBudgetEmail = async (userEmail, eventDetails, budgetBreakdown) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Budget Details for ${eventDetails.eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Event Budget Details</h2>
        <p>Dear Customer,</p>
        <p>Here's the detailed budget breakdown for your <strong>${eventDetails.eventType}</strong> event:</p>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 10px; border: 1px solid #ddd;">Item</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Cost (₹)</th>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Venue</td>
            <td style="padding: 8px; border: 1px solid #ddd;">₹${budgetBreakdown.venue.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Catering</td>
            <td style="padding: 8px; border: 1px solid #ddd;">₹${budgetBreakdown.catering.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Decoration</td>
            <td style="padding: 8px; border: 1px solid #ddd;">₹${budgetBreakdown.decoration.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Photography</td>
            <td style="padding: 8px; border: 1px solid #ddd;">₹${budgetBreakdown.photography.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Entertainment</td>
            <td style="padding: 8px; border: 1px solid #ddd;">₹${budgetBreakdown.entertainment.toLocaleString()}</td>
          </tr>
          <tr style="background-color: #f2f2f2;">
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Total</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>₹${budgetBreakdown.total.toLocaleString()}</strong></td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #e8f5e9;">
          <p><strong>Suggestions:</strong> ${eventDetails.suggestions}</p>
          <p><strong>Description:</strong> ${eventDetails.description}</p>
        </div>
        
        <p>To confirm your event, please login to your dashboard.</p>
        <a href="${process.env.FRONTEND_URL}/my-events" 
           style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none;">
          View My Events
        </a>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

module.exports = { sendEventBudgetEmail };