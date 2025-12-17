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

export const saveSubmission = (formData) => {
  const submissions = JSON.parse(localStorage.getItem('vaptSubmissions') || '[]');
  const newSubmission = {
    ...formData,
    id: Date.now().toString(),
    submittedAt: new Date().toISOString()
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