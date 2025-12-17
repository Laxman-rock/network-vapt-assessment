import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Shield, Building2, FileText, Network, Clock, Lock, CheckCircle2 } from 'lucide-react';
import { saveSubmission } from '../utils/mock';
import { toast } from '../hooks/use-toast';

const VAPTForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: '',
    primaryContactName: '',
    designation: '',
    email: '',
    phone: '',
    secondaryContactName: '',
    secondaryEmail: '',
    secondaryPhone: '',
    assessmentType: [],
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
    setFormData(prev => ({ ...prev, [field]: value }));
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
      setFormData(prev => ({ ...prev, [field]: checked }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.organizationName || !formData.primaryContactName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    saveSubmission(formData);
    toast({
      title: "Success!",
      description: "Your VAPT assessment request has been submitted successfully.",
    });
    
    setTimeout(() => {
      navigate('/admin');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-slate-700" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Network VAPT Assessment</h1>
          <p className="text-slate-600">Initial Information Form - Please fill in the required details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Organization & Contact */}
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-slate-50">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-slate-700" />
                <CardTitle>1. Organization & Contact Information</CardTitle>
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
                  />
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1-555-0123"
                />
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
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryPhone">Phone</Label>
                    <Input
                      id="secondaryPhone"
                      value={formData.secondaryPhone}
                      onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
                      placeholder="+1-555-0124"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Scope Information */}
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-700" />
                <CardTitle>2. Scope Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label className="text-base">2.1 Type of Assessment Required *</Label>
                <div className="space-y-2 pl-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="external"
                      checked={formData.assessmentType.includes('External Network VAPT')}
                      onCheckedChange={(checked) => handleCheckboxChange('assessmentType', 'External Network VAPT', checked)}
                    />
                    <label htmlFor="external" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      External Network VAPT
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="internal"
                      checked={formData.assessmentType.includes('Internal Network VAPT')}
                      onCheckedChange={(checked) => handleCheckboxChange('assessmentType', 'Internal Network VAPT', checked)}
                    />
                    <label htmlFor="internal" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Internal Network VAPT
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="both"
                      checked={formData.assessmentType.includes('Both')}
                      onCheckedChange={(checked) => handleCheckboxChange('assessmentType', 'Both', checked)}
                    />
                    <label htmlFor="both" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Both
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base">2.2 Mode of Testing *</Label>
                <RadioGroup value={formData.testingMode} onValueChange={(value) => handleInputChange('testingMode', value)}>
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
                <Label className="text-base">2.3 Testing for Compliance Purpose?</Label>
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
                <Label htmlFor="ipRange">2.4 IP Range / Assets in Scope</Label>
                <Input
                  id="ipRange"
                  value={formData.ipRange}
                  onChange={(e) => handleInputChange('ipRange', e.target.value)}
                  placeholder="Example: 192.168.1.0/24, 10.0.0.10–10.0.0.50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publicIPs">2.5 Public IP Addresses (if any)</Label>
                <Input
                  id="publicIPs"
                  value={formData.publicIPs}
                  onChange={(e) => handleInputChange('publicIPs', e.target.value)}
                  placeholder="Enter public IPs"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base">2.6 Any systems to exclude from testing?</Label>
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

          {/* Section 3: Network Environment */}
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-slate-50">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-slate-700" />
                <CardTitle>3. Network Environment</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="deviceCount">Approximate number of devices in scope</Label>
                <Select value={formData.deviceCount} onValueChange={(value) => handleInputChange('deviceCount', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select device count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 devices</SelectItem>
                    <SelectItem value="11-50">11-50 devices</SelectItem>
                    <SelectItem value="51-100">51-100 devices</SelectItem>
                    <SelectItem value="101-500">101-500 devices</SelectItem>
                    <SelectItem value="500+">500+ devices</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="environmentType">Environment Type</Label>
                <Select value={formData.environmentType} onValueChange={(value) => handleInputChange('environmentType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
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

          {/* Section 4: Testing Window */}
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-slate-50">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-700" />
                <CardTitle>4. Testing Window & Restrictions</CardTitle>
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notify"
                  checked={formData.notifyBeforeTesting}
                  onCheckedChange={(checked) => handleCheckboxChange('notifyBeforeTesting', null, checked)}
                />
                <label htmlFor="notify" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Notify before testing begins
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Access Requirements */}
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-slate-50">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-slate-700" />
                <CardTitle>5. Access Requirements</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-3">
                <Label className="text-base">If Internal VAPT:</Label>
                <div className="space-y-2 pl-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vpn"
                      checked={formData.vpnAccess}
                      onCheckedChange={(checked) => handleCheckboxChange('vpnAccess', null, checked)}
                    />
                    <label htmlFor="vpn" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      VPN or jump-server access will be provided
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="creds"
                      checked={formData.testCredentials}
                      onCheckedChange={(checked) => handleCheckboxChange('testCredentials', null, checked)}
                    />
                    <label htmlFor="creds" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Test credentials required
                    </label>
                  </div>
                </div>
              </div>
              {formData.testCredentials && (
                <div className="space-y-2 pl-4">
                  <Label>Type of account</Label>
                  <RadioGroup value={formData.accountType} onValueChange={(value) => handleInputChange('accountType', value)}>
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

          {/* Section 6: Reporting */}
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-700" />
                <CardTitle>6. Reporting Requirements</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label>Report Format Required</Label>
                <RadioGroup value={formData.reportFormat} onValueChange={(value) => handleInputChange('reportFormat', value)}>
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
                />
                <label htmlFor="retest" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Require retesting after vulnerabilities are fixed
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Authorization */}
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-slate-50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-slate-700" />
                <CardTitle>7. Authorization</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="permission"
                  checked={formData.permissionApproved}
                  onCheckedChange={(checked) => handleCheckboxChange('permissionApproved', null, checked)}
                />
                <label htmlFor="permission" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Permission approved for conducting VAPT *
                </label>
              </div>
              {formData.permissionApproved && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="approverName">Approver Name</Label>
                    <Input
                      id="approverName"
                      value={formData.approverName}
                      onChange={(e) => handleInputChange('approverName', e.target.value)}
                      placeholder="Enter approver name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="approverDesignation">Designation</Label>
                    <Input
                      id="approverDesignation"
                      value={formData.approverDesignation}
                      onChange={(e) => handleInputChange('approverDesignation', e.target.value)}
                      placeholder="Enter designation"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 8: Additional Notes */}
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-slate-50">
              <CardTitle>8. Additional Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea
                placeholder="Please mention any important points or expectations before testing..."
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
              View Submissions
            </Button>
            <Button type="submit" className="bg-slate-700 hover:bg-slate-800">
              Submit Assessment Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VAPTForm;