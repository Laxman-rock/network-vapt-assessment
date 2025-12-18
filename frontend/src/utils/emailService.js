import emailjs from "@emailjs/browser";

/**
 * Format form data into a readable message string
 * @param {Object} formData - The form submission data
 * @returns {string} - Formatted message string
 */
const formatFormMessage = (formData) => {
  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : 'None';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value;
  };

  let message = `Assessment Details  ${formatValue(formData.organizationName)} - ${formatValue(formData.submittedDateTime || formData.submittedAt)}\n\n`;
  
  message += `Organization Information\n`;
  message += `  Organization: ${formatValue(formData.organizationName)}\n`;
  message += `  Contact: ${formatValue(formData.primaryContactName)} (${formatValue(formData.designation)})\n`;
  message += `  Email: ${formatValue(formData.email)}\n`;
  message += `  Mobile Number: ${formatValue(formData.mobileNumber || formData.phone)}\n`;
  
  if (formData.secondaryContactName || formData.secondaryEmail || formData.secondaryMobileNumber) {
    message += `  Secondary Contact: ${formatValue(formData.secondaryContactName)}\n`;
    message += `  Secondary Email: ${formatValue(formData.secondaryEmail)}\n`;
    message += `  Secondary Mobile: ${formatValue(formData.secondaryMobileNumber)}\n`;
  }
  
  message += `\nScope Information\n`;
  message += `  Assessment Type: ${formatValue(Array.isArray(formData.assessmentType) ? formData.assessmentType.join(", ") : formData.assessmentType)}\n`;
  message += `  Testing Mode: ${formatValue(formData.testingMode)}\n`;
  
  if (formData.complianceRequired) {
    message += `  Compliance Required: Yes\n`;
    message += `  Compliance Type: ${formatValue(formData.complianceType)}\n`;
  }
  
  message += `  IP Range: ${formatValue(formData.ipRange)}\n`;
  if (formData.publicIPs) {
    message += `  Public IPs: ${formatValue(formData.publicIPs)}\n`;
  }
  
  if (formData.excludeSystems && formData.excludedSystemsList) {
    message += `  Excluded Systems: ${formatValue(formData.excludedSystemsList)}\n`;
  }
  
  message += `\nNetwork Environment\n`;
  message += `  Device Count: ${formatValue(formData.deviceCount)}\n`;
  message += `  Environment: ${formatValue(formData.environmentType)}\n`;
  
  message += `\nTesting Window\n`;
  message += `  Preferred Time: ${formatValue(formData.testingWindow)}\n`;
  const restrictions = Array.isArray(formData.restrictions) && formData.restrictions.length > 0
    ? formData.restrictions.join(", ")
    : 'None';
  message += `  Restrictions: ${restrictions}\n`;
  message += `  Notify Before Testing: ${formData.notifyBeforeTesting ? 'Yes' : 'No'}\n`;
  
  message += `\nAccess Requirements\n`;
  message += `  VPN Access: ${formData.vpnAccess ? 'Yes' : 'No'}\n`;
  message += `  Test Credentials: ${formData.testCredentials ? 'Yes' : 'No'}\n`;
  if (formData.accountType) {
    message += `  Account Type: ${formatValue(formData.accountType)}\n`;
  }
  
  message += `\nReporting\n`;
  message += `  Report Format: ${formatValue(formData.reportFormat)}\n`;
  message += `  Retesting Required: ${formData.retestingRequired ? 'Yes' : 'No'}\n`;
  
  if (formData.permissionApproved) {
    message += `\nAuthorization\n`;
    message += `  Permission Approved: Yes\n`;
    if (formData.approverName) {
      message += `  Approver: ${formatValue(formData.approverName)} (${formatValue(formData.approverDesignation)})\n`;
    }
  } else {
    message += `\nAuthorization\n`;
    message += `  Permission Approved: No\n`;
  }
  
  if (formData.additionalNotes) {
    message += `\nAdditional Notes\n`;
    message += `  ${formatValue(formData.additionalNotes)}\n`;
  }
  
  message += `\nSubmission Information\n`;
  if (formData.userIPAddress) {
    message += `  IP Address: ${formatValue(formData.userIPAddress)}\n`;
  }
  
  return message;
};

/**
 * Format time from date string or time string
 * @param {string|Date} dateTime - Date/time value
 * @returns {string} - Formatted time string (HH.MM format)
 */
const formatTime = (dateTime) => {
  if (!dateTime) return new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  }).replace(':', '.');
  
  try {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }).replace(':', '.');
  } catch (e) {
    // If it's already in a time format, try to parse it
    if (typeof dateTime === 'string' && dateTime.includes(':')) {
      return dateTime.split(':').slice(0, 2).join('.');
    }
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }).replace(':', '.');
  }
};

/**
 * Send VAPT form submission email using EmailJS
 * @param {Object} formData - The form submission data
 * @returns {Promise} - EmailJS send promise
 */
export const sendVAPTEmail = async (formData) => {
  // EmailJS configuration - these should be set in your .env file
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_id";
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_id";
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "public_key";

  // Format email parameters to match the sample request format
  const emailParams = {
    title: `VAPT Assessment Request - ${formData.organizationName || "Unknown Organization"}`,
    name: formData.primaryContactName || formData.organizationName || "N/A",
    time: formatTime(formData.submittedDateTime || formData.submittedAt || formData.submittedTime),
    message: formatFormMessage(formData),
    email: formData.email || "N/A",
  };

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      emailParams,
      publicKey
    );
    
    return response;
  } catch (error) {
    console.error("EmailJS error:", error);
    throw error;
  }
};

