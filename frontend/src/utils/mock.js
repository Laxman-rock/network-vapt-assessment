// Mock data and functions for VAPT Form

export const mockSubmissions = [
  {
    id: '1',
    organizationName: 'Tech Corp Solutions',
    primaryContactName: 'John Doe',
    designation: 'IT Security Manager',
    email: 'john.doe@techcorp.com',
    phone: '+1-555-0123',
    assessmentType: ['External Network VAPT', 'Internal Network VAPT'],
    testingMode: 'Hybrid (Remote + On-site)',
    complianceRequired: true,
    complianceType: 'ISO 27001, PCI DSS',
    ipRange: '192.168.1.0/24',
    publicIPs: '203.0.113.10, 203.0.113.11',
    excludeSystems: true,
    excludedSystemsList: 'Production Database Server (192.168.1.100)',
    deviceCount: '50-100',
    environmentType: 'Hybrid',
    testingWindow: 'Non-Business Hours',
    restrictions: ['Avoid DoS-like tests', 'Notify before testing begins'],
    notifyBeforeTesting: true,
    vpnAccess: true,
    testCredentials: true,
    accountType: 'Admin',
    reportFormat: 'Technical + Management Summary',
    retestingRequired: true,
    permissionApproved: true,
    approverName: 'Jane Smith',
    approverDesignation: 'CTO',
    additionalNotes: 'Please schedule testing during weekend maintenance window',
    submittedAt: '2025-01-15T10:30:00Z'
  }
];

export const saveSubmission = async (formData) => {
  // Automatically fetch user's IP address
  let userIP = 'Unknown';
  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      userIP = data.ip || 'Unknown';
    }
  } catch (error) {
    console.error('Failed to get IP address automatically:', error);
    // Try alternative IP service as fallback
    try {
      const fallbackResponse = await fetch('https://api64.ipify.org?format=json');
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        userIP = fallbackData.ip || 'Unknown';
      }
    } catch (fallbackError) {
      console.error('Fallback IP service also failed:', fallbackError);
    }
  }

  // Automatically capture current date and time
  const now = new Date();
  const submissions = JSON.parse(localStorage.getItem('vaptSubmissions') || '[]');
  
  const newSubmission = {
    ...formData,
    id: Date.now().toString(),
    // ISO format for compatibility
    submittedAt: now.toISOString(),
    // Formatted date only
    submittedDate: now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    // Formatted time only
    submittedTime: now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }),
    // Combined date and time
    submittedDateTime: now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }),
    // Automatically captured IP address
    userIPAddress: userIP
  };
  
  submissions.push(newSubmission);
  localStorage.setItem('vaptSubmissions', JSON.stringify(submissions));
  return newSubmission;
};

export const getSubmissions = () => {
  return JSON.parse(localStorage.getItem('vaptSubmissions') || '[]');
};

export const clearSubmissions = () => {
  localStorage.removeItem('vaptSubmissions');
};