import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Progress } from '../components/ui/progress';
import { Shield, Building2, FileText, Network, Clock, Lock, CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { saveSubmission } from '../utils/mock';
import { toast } from '../hooks/use-toast';
import { sendVAPTEmail } from '../utils/emailService';

const VAPTFormSteps = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    organizationName: '',
    primaryContactName: '',
    designation: '',
    email: '',
    mobileNumber: '',
    secondaryContactName: '',
    secondaryEmail: '',
    secondaryMobileNumber: '',
    assessmentType: '',
    testingMode: '',
    complianceRequired: false,
    complianceType: '',
    ipRange: '',
    publicIPs: '',
    excludeSystems: false,
    excludedSystemsList: '',
    deviceCount: '',
    environmentType: '',
    testingWindow: '',
    restrictions: [],
    notifyBeforeTesting: false,
    vpnAccess: false,
    testCredentials: false,
    accountType: '',
    reportFormat: '',
    retestingRequired: false,
    permissionApproved: false,
    approverName: '',
    approverDesignation: '',
    additionalNotes: ''
  });

  const handleInputChange = (field, value) => {
    // Apply input filtering based on field type
    let filteredValue = value;
    
    if (field === 'primaryContactName' || field === 'designation') {
      // Only allow alphabets and spaces
      filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (field === 'deviceCount') {
      // Only allow digits, max 4 digits
      filteredValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setFormData(prev => ({ ...prev, [field]: filteredValue }));
    // Clear error for this field when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (field, value, checked) => {
    if (Array.isArray(formData[field])) {
      setFormData(prev => ({
        ...prev,
        [field]: checked 
          ? [...prev[field], value]
          : prev[field].filter(item => item !== value)
      }));
    } else {
      setFormData(prev => {
        const updated = { ...prev, [field]: checked };
        // Clear accountType when testCredentials is unchecked
        if (field === 'testCredentials' && !checked) {
          updated.accountType = '';
        }
        return updated;
      });
    }
  };

  const validateMobileNumber = (mobile) => {
    // Mobile number validation: 10 digits starting with 6, 7, 8, or 9
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const validateEmail = (email) => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.trim().length > 0;
  };

  const validateAlphabetsOnly = (value) => {
    // Only alphabets and spaces allowed
    const alphabetRegex = /^[a-zA-Z\s]+$/;
    return alphabetRegex.test(value) && value.trim().length > 0;
  };

  const validateDeviceCount = (deviceCount) => {
    // Must be exactly 4 digits
    const deviceCountRegex = /^\d{4}$/;
    return deviceCountRegex.test(deviceCount);
  };

  const validateIPRange = (ipRange) => {
    if (!ipRange || ipRange.trim() === '') return false;
    
    // Only allow numeric characters and special characters (., /, -, comma, space)
    // This allows any combination of numbers and these special characters
    const ipFormatRegex = /^[0-9.\/\-\s,]+$/;
    return ipFormatRegex.test(ipRange);
  };

  const validateStep = (step) => {
    const errors = {};
    switch(step) {
      case 1:
        if (!formData.organizationName) errors.organizationName = true;
        if (!formData.primaryContactName) errors.primaryContactName = true;
        if (!formData.designation || formData.designation.trim() === '') errors.designation = true;
        if (!formData.email) errors.email = true;
        if (!formData.mobileNumber) errors.mobileNumber = true;
        
        if (!formData.organizationName || !formData.primaryContactName || !formData.designation || formData.designation.trim() === '' || !formData.email || !formData.mobileNumber) {
          setFieldErrors(errors);
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields (Organization Name, Contact Name, Designation, Email, Mobile Number).",
            variant: "destructive"
          });
          return false;
        }
        if (!validateEmail(formData.email)) {
          errors.email = true;
          setFieldErrors(errors);
          toast({
            title: "Invalid Email",
            description: "Please enter a valid email address.",
            variant: "destructive"
          });
          return false;
        }
        if (formData.secondaryEmail && !validateEmail(formData.secondaryEmail)) {
          errors.secondaryEmail = true;
          setFieldErrors(errors);
          toast({
            title: "Invalid Secondary Email",
            description: "Please enter a valid secondary email address.",
            variant: "destructive"
          });
          return false;
        }
        if (!validateAlphabetsOnly(formData.primaryContactName)) {
          errors.primaryContactName = true;
          setFieldErrors(errors);
          toast({
            title: "Invalid Contact Name",
            description: "Primary contact name must contain only alphabets and spaces.",
            variant: "destructive"
          });
          return false;
        }
        if (!validateAlphabetsOnly(formData.designation)) {
          errors.designation = true;
          setFieldErrors(errors);
          toast({
            title: "Invalid Designation",
            description: "Designation must contain only alphabets and spaces.",
            variant: "destructive"
          });
          return false;
        }
        if (!validateMobileNumber(formData.mobileNumber)) {
          errors.mobileNumber = true;
          setFieldErrors(errors);
          toast({
            title: "Invalid Mobile Number",
            description: "Mobile number must be 10 digits and start with 6, 7, 8, or 9.",
            variant: "destructive"
          });
          return false;
        }
        if (formData.secondaryMobileNumber && !validateMobileNumber(formData.secondaryMobileNumber)) {
          errors.secondaryMobileNumber = true;
          setFieldErrors(errors);
          toast({
            title: "Invalid Secondary Mobile Number",
            description: "Secondary mobile number must be 10 digits and start with 6, 7, 8, or 9.",
            variant: "destructive"
          });
          return false;
        }
        setFieldErrors({});
        return true;
      case 2:
        if (!formData.assessmentType || !formData.testingMode) {
          toast({
            title: "Missing Information",
            description: "Please select assessment type and testing mode.",
            variant: "destructive"
          });
          return false;
        }
        if (!formData.ipRange || !validateIPRange(formData.ipRange)) {
          toast({
            title: "Invalid IP Range",
            description: "Please enter a valid IP address, IP range (e.g., 192.168.1.0-192.168.1.255), or CIDR notation (e.g., 192.168.1.0/24).",
            variant: "destructive"
          });
          return false;
        }
        if (formData.publicIPs && !validateIPRange(formData.publicIPs)) {
          toast({
            title: "Invalid Public IP Addresses",
            description: "Please enter a valid IP address, IP range, or CIDR notation for public IPs.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 3:
        const errors3 = {};
        if (!formData.deviceCount || formData.deviceCount.trim() === '') errors3.deviceCount = true;
        if (!formData.environmentType || formData.environmentType.trim() === '') errors3.environmentType = true;
        
        if (!formData.deviceCount || formData.deviceCount.trim() === '') {
          setFieldErrors(errors3);
          toast({
            title: "Missing Information",
            description: "Please enter the number of devices in scope.",
            variant: "destructive"
          });
          return false;
        }
        if (!validateDeviceCount(formData.deviceCount)) {
          errors3.deviceCount = true;
          setFieldErrors(errors3);
          toast({
            title: "Invalid Device Count",
            description: "Device count must be exactly 4 digits.",
            variant: "destructive"
          });
          return false;
        }
        if (!formData.environmentType || formData.environmentType.trim() === '') {
          setFieldErrors(errors3);
          toast({
            title: "Missing Information",
            description: "Please enter the environment type.",
            variant: "destructive"
          });
          return false;
        }
        setFieldErrors({});
        return true;
      case 4:
        // No validation needed for step 4
        return true;
      case 5:
        const errors5 = {};
        if (!formData.vpnAccess && !formData.testCredentials) {
          setFieldErrors(errors5);
          toast({
            title: "Missing Information",
            description: "Please select at least one access requirement (VPN access or Test credentials).",
            variant: "destructive"
          });
          return false;
        }
        if (formData.testCredentials && !formData.accountType) {
          errors5.accountType = true;
          setFieldErrors(errors5);
          toast({
            title: "Missing Information",
            description: "Please select the type of account when test credentials are required.",
            variant: "destructive"
          });
          return false;
        }
        setFieldErrors({});
        return true;
      case 6:
        const errors6 = {};
        if (!formData.reportFormat) errors6.reportFormat = true;
        if (formData.retestingRequired === undefined || formData.retestingRequired === null) errors6.retestingRequired = true;
        
        if (!formData.reportFormat) {
          setFieldErrors(errors6);
          toast({
            title: "Missing Information",
            description: "Please select a report format.",
            variant: "destructive"
          });
          return false;
        }
        if (formData.retestingRequired === undefined || formData.retestingRequired === null) {
          setFieldErrors(errors6);
          toast({
            title: "Missing Information",
            description: "Please confirm if retesting is required.",
            variant: "destructive"
          });
          return false;
        }
        setFieldErrors({});
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    const errors = {};
    if (!formData.organizationName) errors.organizationName = true;
    if (!formData.primaryContactName) errors.primaryContactName = true;
    if (!formData.designation || formData.designation.trim() === '') errors.designation = true;
    if (!formData.email) errors.email = true;
    if (!formData.mobileNumber) errors.mobileNumber = true;
    
    if (!formData.organizationName || !formData.primaryContactName || !formData.designation || formData.designation.trim() === '' || !formData.email || !formData.mobileNumber) {
      setFieldErrors(errors);
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Organization Name, Contact Name, Designation, Email, Mobile Number).",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      errors.email = true;
      setFieldErrors(errors);
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    if (formData.secondaryEmail && !validateEmail(formData.secondaryEmail)) {
      errors.secondaryEmail = true;
      setFieldErrors(errors);
      toast({
        title: "Invalid Secondary Email",
        description: "Please enter a valid secondary email address.",
        variant: "destructive"
      });
      return;
    }

    if (!validateAlphabetsOnly(formData.primaryContactName)) {
      errors.primaryContactName = true;
      setFieldErrors(errors);
      toast({
        title: "Invalid Contact Name",
        description: "Primary contact name must contain only alphabets and spaces.",
        variant: "destructive"
      });
      return;
    }

    if (!validateAlphabetsOnly(formData.designation)) {
      errors.designation = true;
      setFieldErrors(errors);
      toast({
        title: "Invalid Designation",
        description: "Designation must contain only alphabets and spaces.",
        variant: "destructive"
      });
      return;
    }

    if (!validateMobileNumber(formData.mobileNumber)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Mobile number must be 10 digits and start with 6, 7, 8, or 9.",
        variant: "destructive"
      });
      return;
    }

    if (formData.secondaryMobileNumber && !validateMobileNumber(formData.secondaryMobileNumber)) {
      toast({
        title: "Invalid Secondary Mobile Number",
        description: "Secondary mobile number must be 10 digits and start with 6, 7, 8, or 9.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.ipRange || !validateIPRange(formData.ipRange)) {
      toast({
        title: "Invalid IP Range",
        description: "Please enter a valid IP address, IP range (e.g., 192.168.1.0-192.168.1.255), or CIDR notation (e.g., 192.168.1.0/24).",
        variant: "destructive"
      });
      return;
    }

    if (!validateDeviceCount(formData.deviceCount)) {
      toast({
        title: "Invalid Device Count",
        description: "Device count must be exactly 4 digits.",
        variant: "destructive"
      });
      return;
    }

    if (formData.publicIPs && !validateIPRange(formData.publicIPs)) {
      toast({
        title: "Invalid Public IP Addresses",
        description: "Please enter a valid IP address, IP range, or CIDR notation for public IPs.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionProgress(0);

    try {
      // Simulate progress
      setSubmissionProgress(30);
      
      // Save to localStorage (mock) - now async to get IP address
      const submission = await saveSubmission(formData);
      setSubmissionProgress(60);
      
      // Send email notification using EmailJS
      try {
        await sendVAPTEmail(submission);
        setSubmissionProgress(100);
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        setSubmissionProgress(100);
      }

      setIsSubmitting(false);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to save submission. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-slate-50">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-slate-700" />
                <CardTitle>Organization & Contact Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name *</Label>
                  <Input
                    id="organizationName"
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    placeholder="Enter organization name"
                    required
                    className={fieldErrors.organizationName ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryContactName">Primary Contact Name *</Label>
                  <Input
                    id="primaryContactName"
                    value={formData.primaryContactName}
                    onChange={(e) => handleInputChange('primaryContactName', e.target.value)}
                    placeholder="Enter contact name"
                    required
                    className={fieldErrors.primaryContactName ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {formData.primaryContactName && !validateAlphabetsOnly(formData.primaryContactName) && (
                    <p className="text-sm text-red-500">Contact name must contain only alphabets and spaces</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    placeholder="e.g., IT Manager"
                    className={fieldErrors.designation ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {formData.designation && !validateAlphabetsOnly(formData.designation) && (
                    <p className="text-sm text-red-500">Designation must contain only alphabets and spaces</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@cyberaran.com"
                    required
                    className={fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {formData.email && !validateEmail(formData.email) && (
                    <p className="text-sm text-red-500">Please enter a valid email address</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number *</Label>
                <div className="flex items-center">
                  <span className="flex h-9 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 py-1 text-sm text-muted-foreground">+91</span>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      handleInputChange('mobileNumber', value);
                    }}
                    placeholder="9876543210"
                    maxLength={10}
                    required
                    className={`rounded-l-none ${fieldErrors.mobileNumber ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold text-slate-700 mb-3">Secondary Contact (Optional)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="secondaryContactName">Name</Label>
                    <Input
                      id="secondaryContactName"
                      value={formData.secondaryContactName}
                      onChange={(e) => handleInputChange('secondaryContactName', e.target.value)}
                      placeholder="Contact name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryEmail">Email</Label>
                      <Input
                      id="secondaryEmail"
                      type="email"
                      value={formData.secondaryEmail}
                      onChange={(e) => handleInputChange('secondaryEmail', e.target.value)}
                      placeholder="email@cyberaran.com"
                      className={fieldErrors.secondaryEmail ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {formData.secondaryEmail && !validateEmail(formData.secondaryEmail) && (
                      <p className="text-sm text-red-500">Please enter a valid email address</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryMobileNumber">Mobile Number</Label>
                    <div className="flex items-center">
                      <span className="flex h-9 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 py-1 text-sm text-muted-foreground">+91</span>
                      <Input
                        id="secondaryMobileNumber"
                        type="tel"
                        value={formData.secondaryMobileNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          handleInputChange('secondaryMobileNumber', value);
                        }}
                        placeholder="9876543210"
                        maxLength={10}
                        className={`rounded-l-none ${fieldErrors.secondaryMobileNumber ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-700" />
                <CardTitle>Scope Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label className="text-base">Type of Assessment Required *</Label>
                <RadioGroup 
                  value={formData.assessmentType} 
                  onValueChange={(value) => handleInputChange('assessmentType', value)}
                  className={fieldErrors.assessmentType ? "ring-2 ring-red-500 rounded-md p-2" : ""}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="External Network VAPT" id="external" />
                    <label htmlFor="external" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      External Network VAPT
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Internal Network VAPT" id="internal" />
                    <label htmlFor="internal" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Internal Network VAPT
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Both" id="both" />
                    <label htmlFor="both" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Both
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base">Mode of Testing *</Label>
                <RadioGroup 
                  value={formData.testingMode} 
                  onValueChange={(value) => handleInputChange('testingMode', value)}
                  className={fieldErrors.testingMode ? "ring-2 ring-red-500 rounded-md p-2" : ""}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="In-house / On-site Testing" id="onsite" />
                    <label htmlFor="onsite" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      In-house / On-site Testing
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Remote Testing" id="remote" />
                    <label htmlFor="remote" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Remote Testing
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Hybrid (Remote + On-site)" id="hybrid" />
                    <label htmlFor="hybrid" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Hybrid (Remote + On-site)
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base">Testing for Compliance Purpose?</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="compliance"
                    checked={formData.complianceRequired}
                    onCheckedChange={(checked) => handleCheckboxChange('complianceRequired', null, checked)}
                  />
                  <label htmlFor="compliance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Yes, testing for compliance
                  </label>
                </div>
                {formData.complianceRequired && (
                  <Input
                    placeholder="Specify: ISO 27001, PCI DSS, EN 18031, DPDP, etc."
                    value={formData.complianceType}
                    onChange={(e) => handleInputChange('complianceType', e.target.value)}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipRange">IP Range / Assets in Scope *</Label>
                <Input
                  id="ipRange"
                  value={formData.ipRange}
                  onChange={(e) => handleInputChange('ipRange', e.target.value)}
                  placeholder="Example: 192.168.1.0/24, 10.0.0.10-10.0.0.50, 192.168.1.1"
                  required
                  className={fieldErrors.ipRange ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {formData.ipRange && !validateIPRange(formData.ipRange) && (
                  <p className="text-sm text-red-500">Please enter a valid IP address, IP range, or CIDR notation</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="publicIPs">Public IP Addresses (Optional)</Label>
                <Input
                  id="publicIPs"
                  value={formData.publicIPs}
                  onChange={(e) => handleInputChange('publicIPs', e.target.value)}
                  placeholder="Example: 203.0.113.1, 198.51.100.1"
                  className={fieldErrors.publicIPs ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {formData.publicIPs && !validateIPRange(formData.publicIPs) && (
                  <p className="text-sm text-red-500">Please enter a valid IP address, IP range, or CIDR notation</p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-base">Any systems to exclude from testing?</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excludeSystems"
                    checked={formData.excludeSystems}
                    onCheckedChange={(checked) => handleCheckboxChange('excludeSystems', null, checked)}
                  />
                  <label htmlFor="excludeSystems" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Yes, exclude some systems
                  </label>
                </div>
                {formData.excludeSystems && (
                  <Textarea
                    placeholder="List systems to exclude..."
                    value={formData.excludedSystemsList}
                    onChange={(e) => handleInputChange('excludedSystemsList', e.target.value)}
                    rows={3}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-slate-50">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-slate-700" />
                <CardTitle>Network Environment</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="deviceCount">Approximate number of devices in scope *</Label>
                <Input
                  id="deviceCount"
                  type="number"
                  value={formData.deviceCount}
                  onChange={(e) => handleInputChange('deviceCount', e.target.value)}
                  placeholder="Enter 4-digit number (e.g., 1234)"
                  required
                  maxLength="4"
                  className={fieldErrors.deviceCount ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {formData.deviceCount && !validateDeviceCount(formData.deviceCount) && (
                  <p className="text-sm text-red-500">Device count must be exactly 4 digits</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="environmentType">Environment Type *</Label>
                <Select
                  value={formData.environmentType}
                  onValueChange={(value) => handleInputChange('environmentType', value)}
                  required
                >
                  <SelectTrigger 
                    id="environmentType"
                    className={fieldErrors.environmentType ? "border-red-500 focus:ring-red-500" : ""}
                  >
                    <SelectValue placeholder="Select environment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Data Center">Data Center</SelectItem>
                    <SelectItem value="Cloud">Cloud</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-slate-50">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-700" />
                <CardTitle>Testing Window & Restrictions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-3">
                <Label className="text-base">Preferred Testing Time</Label>
                <RadioGroup value={formData.testingWindow} onValueChange={(value) => handleInputChange('testingWindow', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Business Hours" id="business" />
                    <label htmlFor="business" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Business Hours
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Non-Business Hours" id="nonbusiness" />
                    <label htmlFor="nonbusiness" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Non-Business Hours
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Weekend" id="weekend" />
                    <label htmlFor="weekend" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Weekend
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No Preference" id="nopref" />
                    <label htmlFor="nopref" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      No Preference
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base">Restrictions During Testing</Label>
                <div className="space-y-2 pl-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="avoidScanning"
                      checked={formData.restrictions.includes('Avoid heavy scanning')}
                      onCheckedChange={(checked) => handleCheckboxChange('restrictions', 'Avoid heavy scanning', checked)}
                    />
                    <label htmlFor="avoidScanning" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Avoid heavy scanning
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="avoidBrute"
                      checked={formData.restrictions.includes('Avoid brute force testing')}
                      onCheckedChange={(checked) => handleCheckboxChange('restrictions', 'Avoid brute force testing', checked)}
                    />
                    <label htmlFor="avoidBrute" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Avoid brute force testing
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="avoidDos"
                      checked={formData.restrictions.includes('Avoid DoS-like tests')}
                      onCheckedChange={(checked) => handleCheckboxChange('restrictions', 'Avoid DoS-like tests', checked)}
                    />
                    <label htmlFor="avoidDos" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Avoid DoS-like tests
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noRestrictions"
                      checked={formData.restrictions.includes('No restrictions')}
                      onCheckedChange={(checked) => handleCheckboxChange('restrictions', 'No restrictions', checked)}
                    />
                    <label htmlFor="noRestrictions" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      No restrictions
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-slate-50">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-slate-700" />
                <CardTitle>Access Requirements</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-3">
                <Label className="text-base">If Internal VAPT: *</Label>
                <div className="space-y-2 pl-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vpn"
                      checked={formData.vpnAccess}
                      onCheckedChange={(checked) => handleCheckboxChange('vpnAccess', null, checked)}
                      required
                    />
                    <label htmlFor="vpn" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      VPN or jump-server access will be provided *
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="creds"
                      checked={formData.testCredentials}
                      onCheckedChange={(checked) => handleCheckboxChange('testCredentials', null, checked)}
                      required
                    />
                    <label htmlFor="creds" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Test credentials required *
                    </label>
                  </div>
                </div>
              </div>
              {formData.testCredentials && (
                <div className="space-y-2 pl-4">
                  <Label>Type of account *</Label>
                  <RadioGroup 
                    value={formData.accountType} 
                    onValueChange={(value) => handleInputChange('accountType', value)} 
                    required
                    className={fieldErrors.accountType ? "ring-2 ring-red-500 rounded-md p-2" : ""}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="User" id="user" />
                      <label htmlFor="user" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        User
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Admin" id="admin" />
                      <label htmlFor="admin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Admin
                      </label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-700" />
                <CardTitle>Reporting Requirements</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label>Report Format Required *</Label>
                <RadioGroup 
                  value={formData.reportFormat} 
                  onValueChange={(value) => handleInputChange('reportFormat', value)} 
                  required
                  className={fieldErrors.reportFormat ? "ring-2 ring-red-500 rounded-md p-2" : ""}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Technical Report" id="tech" />
                    <label htmlFor="tech" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Technical Report
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Technical + Management Summary" id="both-report" />
                    <label htmlFor="both-report" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Technical + Management Summary
                    </label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="retest"
                  checked={formData.retestingRequired}
                  onCheckedChange={(checked) => handleCheckboxChange('retestingRequired', null, checked)}
                  required
                />
                <label htmlFor="retest" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Require retesting after vulnerabilities are fixed *
                </label>
              </div>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-slate-50">
              <CardTitle>Additional Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea
                placeholder="Please mention any important points or expectations before testing..."
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                rows={6}
              />
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Progress Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4 shadow-2xl">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-slate-700" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Submitting Your Request</h3>
                  <p className="text-sm text-slate-600 mb-4">Please wait while we process your VAPT assessment request...</p>
                  <Progress value={submissionProgress} className="w-full" />
                  <p className="text-xs text-slate-500 mt-2">{submissionProgress}% Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <img 
                src="/favicon/cyberaran-favicon.png" 
                alt="CyberAran Logo" 
                className="h-16 w-16 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center" style={{ display: 'none' }}>
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">Submission Successful!</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              Your VAPT assessment request has been submitted successfully. 
              We have received your information and will contact you shortly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction 
              onClick={() => {
                setShowConfirmation(false);
                navigate('/admin');
              }}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              View Submissions
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-slate-700" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Network VAPT</h1>
          <p className="text-slate-600">Initial Information Form</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    step < currentStep 
                      ? 'bg-green-600 text-white' 
                      : step === currentStep 
                      ? 'bg-slate-700 text-white' 
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                <span className="text-xs mt-1 text-slate-600 hidden md:block">
                  {step === 1 && 'Contact'}
                  {step === 2 && 'Scope'}
                  {step === 3 && 'Network'}
                  {step === 4 && 'Testing'}
                  {step === 5 && 'Access'}
                  {step === 6 && 'Report'}
                  {step === 7 && 'Notes'}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-slate-700 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            {currentStep === totalSteps && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin')}
              >
                View Submissions
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button 
                type="button" 
                onClick={handleNext}
                className="bg-slate-700 hover:bg-slate-800 flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Assessment Request'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default VAPTFormSteps;