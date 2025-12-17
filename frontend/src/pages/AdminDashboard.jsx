import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { ArrowLeft, FileText, Eye, Calendar } from 'lucide-react';
import { getSubmissions } from '../utils/mock';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    const data = getSubmissions();
    setSubmissions(data);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">VAPT Assessment Submissions</h1>
            <p className="text-slate-600">View and manage all assessment requests</p>
          </div>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Form
          </Button>
        </div>

        <Card className="shadow-md border-slate-200">
          <CardHeader className="bg-slate-50">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              All Submissions ({submissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {submissions.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No submissions yet</p>
                <p className="text-sm">Submit a new VAPT assessment request to see it here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Assessment Type</TableHead>
                      <TableHead>Testing Mode</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.organizationName}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{submission.primaryContactName}</div>
                            <div className="text-slate-500">{submission.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {submission.assessmentType.map((type, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{submission.testingMode}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Calendar className="h-3 w-3" />
                            {formatDate(submission.submittedAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                              <SheetHeader>
                                <SheetTitle>Assessment Details</SheetTitle>
                                <SheetDescription>
                                  {submission.organizationName} - {formatDate(submission.submittedAt)}
                                </SheetDescription>
                              </SheetHeader>
                              <div className="mt-6 space-y-6">
                                <div>
                                  <h3 className="font-semibold text-sm text-slate-700 mb-2">Organization Information</h3>
                                  <div className="space-y-1 text-sm">
                                    <p><strong>Organization:</strong> {submission.organizationName}</p>
                                    <p><strong>Contact:</strong> {submission.primaryContactName} ({submission.designation})</p>
                                    <p><strong>Email:</strong> {submission.email}</p>
                                    <p><strong>Phone:</strong> {submission.phone}</p>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold text-sm text-slate-700 mb-2">Scope Information</h3>
                                  <div className="space-y-1 text-sm">
                                    <p><strong>Assessment Type:</strong> {submission.assessmentType.join(', ')}</p>
                                    <p><strong>Testing Mode:</strong> {submission.testingMode}</p>
                                    {submission.complianceRequired && (
                                      <p><strong>Compliance:</strong> {submission.complianceType}</p>
                                    )}
                                    {submission.ipRange && <p><strong>IP Range:</strong> {submission.ipRange}</p>}
                                    {submission.publicIPs && <p><strong>Public IPs:</strong> {submission.publicIPs}</p>}
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold text-sm text-slate-700 mb-2">Network Environment</h3>
                                  <div className="space-y-1 text-sm">
                                    <p><strong>Device Count:</strong> {submission.deviceCount}</p>
                                    <p><strong>Environment:</strong> {submission.environmentType}</p>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold text-sm text-slate-700 mb-2">Testing Window</h3>
                                  <div className="space-y-1 text-sm">
                                    <p><strong>Preferred Time:</strong> {submission.testingWindow}</p>
                                    {submission.restrictions.length > 0 && (
                                      <p><strong>Restrictions:</strong> {submission.restrictions.join(', ')}</p>
                                    )}
                                    <p><strong>Notify Before Testing:</strong> {submission.notifyBeforeTesting ? 'Yes' : 'No'}</p>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold text-sm text-slate-700 mb-2">Access Requirements</h3>
                                  <div className="space-y-1 text-sm">
                                    <p><strong>VPN Access:</strong> {submission.vpnAccess ? 'Yes' : 'No'}</p>
                                    <p><strong>Test Credentials:</strong> {submission.testCredentials ? `Yes (${submission.accountType})` : 'No'}</p>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold text-sm text-slate-700 mb-2">Reporting</h3>
                                  <div className="space-y-1 text-sm">
                                    <p><strong>Report Format:</strong> {submission.reportFormat}</p>
                                    <p><strong>Retesting Required:</strong> {submission.retestingRequired ? 'Yes' : 'No'}</p>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold text-sm text-slate-700 mb-2">Authorization</h3>
                                  <div className="space-y-1 text-sm">
                                    <p><strong>Permission Approved:</strong> {submission.permissionApproved ? 'Yes' : 'No'}</p>
                                    {submission.permissionApproved && (
                                      <>
                                        <p><strong>Approver:</strong> {submission.approverName} ({submission.approverDesignation})</p>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {submission.additionalNotes && (
                                  <div>
                                    <h3 className="font-semibold text-sm text-slate-700 mb-2">Additional Notes</h3>
                                    <p className="text-sm text-slate-600">{submission.additionalNotes}</p>
                                  </div>
                                )}
                              </div>
                            </SheetContent>
                          </Sheet>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;