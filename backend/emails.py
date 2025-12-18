from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os
import logging

logger = logging.getLogger(__name__)

class EmailDeliveryError(Exception):
    pass

def send_vapt_submission_email(form_data: dict):
    """
    Send VAPT form submission notification email
    
    Args:
        form_data: Dictionary containing all form submission data
    """
    sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
    sender_email = os.getenv('SENDER_EMAIL', 'noreply@example.com')
    recipient_email = sender_email  # Send to the same sender email address
    
    if not sendgrid_api_key:
        logger.warning("SendGrid API key not configured")
        raise EmailDeliveryError("Email service not configured")
    
    subject = f"New VAPT Assessment Request - {form_data.get('organizationName', 'Unknown Organization')}"
    
    # Build email content
    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 800px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #334155 0%, #475569 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }}
            .section {{ background: white; margin-bottom: 20px; padding: 20px; border-radius: 8px; border-left: 4px solid #334155; }}
            .section-title {{ color: #334155; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }}
            .field {{ margin-bottom: 12px; }}
            .field-label {{ font-weight: bold; color: #475569; }}
            .field-value {{ color: #1e293b; margin-left: 10px; }}
            .badge {{ display: inline-block; padding: 4px 8px; background: #e0e7ff; color: #3730a3; border-radius: 4px; font-size: 12px; margin: 2px; }}
            .footer {{ text-align: center; padding: 20px; color: #64748b; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>New VAPT Assessment Request</h1>
                <p>A new Network VAPT assessment form has been submitted</p>
            </div>
            
            <div class="content">
                <div class="section">
                    <div class="section-title">Organization & Contact Information</div>
                    <div class="field">
                        <span class="field-label">Organization Name:</span>
                        <span class="field-value">{form_data.get('organizationName', 'N/A')}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">Primary Contact:</span>
                        <span class="field-value">{form_data.get('primaryContactName', 'N/A')} ({form_data.get('designation', 'N/A')})</span>
                    </div>
                    <div class="field">
                        <span class="field-label">Email:</span>
                        <span class="field-value">{form_data.get('email', 'N/A')}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">Phone:</span>
                        <span class="field-value">{form_data.get('phone', 'N/A')}</span>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title">Scope Information</div>
                    <div class="field">
                        <span class="field-label">Assessment Type:</span>
                        <span class="field-value">
                            {''.join([f'<span class="badge">{atype}</span>' for atype in form_data.get('assessmentType', [])])}
                        </span>
                    </div>
                    <div class="field">
                        <span class="field-label">Testing Mode:</span>
                        <span class="field-value">{form_data.get('testingMode', 'N/A')}</span>
                    </div>
                    {f'''<div class="field">
                        <span class="field-label">Compliance:</span>
                        <span class="field-value">{form_data.get('complianceType', 'N/A')}</span>
                    </div>''' if form_data.get('complianceRequired') else ''}
                    {f'''<div class="field">
                        <span class="field-label">IP Range:</span>
                        <span class="field-value">{form_data.get('ipRange', 'N/A')}</span>
                    </div>''' if form_data.get('ipRange') else ''}
                    {f'''<div class="field">
                        <span class="field-label">Public IPs:</span>
                        <span class="field-value">{form_data.get('publicIPs', 'N/A')}</span>
                    </div>''' if form_data.get('publicIPs') else ''}
                </div>
                
                <div class="section">
                    <div class="section-title">Network Environment</div>
                    <div class="field">
                        <span class="field-label">Device Count:</span>
                        <span class="field-value">{form_data.get('deviceCount', 'N/A')}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">Environment Type:</span>
                        <span class="field-value">{form_data.get('environmentType', 'N/A')}</span>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title">Testing Window & Access</div>
                    <div class="field">
                        <span class="field-label">Preferred Testing Time:</span>
                        <span class="field-value">{form_data.get('testingWindow', 'N/A')}</span>
                    </div>
                    {f'''<div class="field">
                        <span class="field-label">Restrictions:</span>
                        <span class="field-value">{''.join([f'<span class="badge">{r}</span>' for r in form_data.get('restrictions', [])])}</span>
                    </div>''' if form_data.get('restrictions') else ''}
                    <div class="field">
                        <span class="field-label">VPN Access:</span>
                        <span class="field-value">{'Yes' if form_data.get('vpnAccess') else 'No'}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">Test Credentials:</span>
                        <span class="field-value">{'Yes (' + form_data.get('accountType', '') + ')' if form_data.get('testCredentials') else 'No'}</span>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title">Reporting & Authorization</div>
                    <div class="field">
                        <span class="field-label">Report Format:</span>
                        <span class="field-value">{form_data.get('reportFormat', 'N/A')}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">Retesting Required:</span>
                        <span class="field-value">{'Yes' if form_data.get('retestingRequired') else 'No'}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">Permission Approved:</span>
                        <span class="field-value">{'Yes' if form_data.get('permissionApproved') else 'No'}</span>
                    </div>
                    {f'''<div class="field">
                        <span class="field-label">Approver:</span>
                        <span class="field-value">{form_data.get('approverName', 'N/A')} ({form_data.get('approverDesignation', 'N/A')})</span>
                    </div>''' if form_data.get('permissionApproved') else ''}
                </div>
                
                {f'''<div class="section">
                    <div class="section-title">Additional Notes</div>
                    <p>{form_data.get('additionalNotes', 'None')}</p>
                </div>''' if form_data.get('additionalNotes') else ''}
                
                <div class="section">
                    <div class="section-title">Submission Information</div>
                    <div class="field">
                        <span class="field-label">Submission ID:</span>
                        <span class="field-value">{form_data.get('id', 'N/A')}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">Submitted Date & Time:</span>
                        <span class="field-value">{form_data.get('submittedDateTime', form_data.get('submittedAt', 'N/A'))}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">User IP Address:</span>
                        <span class="field-value">{form_data.get('userIPAddress', 'N/A')}</span>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p>This is an automated notification from the VAPT Assessment System</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    message = Mail(
        from_email=sender_email,
        to_emails=recipient_email,
        subject=subject,
        html_content=html_content
    )
    
    try:
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        logger.info(f"Email sent successfully: {response.status_code}")
        return response.status_code == 202
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise EmailDeliveryError(f"Failed to send email: {str(e)}")