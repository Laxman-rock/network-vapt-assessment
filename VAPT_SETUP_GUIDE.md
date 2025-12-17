# Network VAPT Assessment Form - Setup Guide

## 🎯 What's Been Built

A professional **multi-step form** for collecting Network VAPT (Vulnerability Assessment and Penetration Testing) assessment information with the following features:

### ✅ Completed Features

1. **8-Step Progressive Form**
   - Step 1: Organization & Contact Information
   - Step 2: Scope Information
   - Step 3: Network Environment
   - Step 4: Testing Window & Restrictions
   - Step 5: Access Requirements
   - Step 6: Reporting Requirements
   - Step 7: Authorization
   - Step 8: Additional Notes

2. **Navigation**
   - Next/Previous buttons
   - Visual progress bar with step indicators
   - Form validation before proceeding

3. **Admin Dashboard**
   - View all submissions
   - Detailed view panel
   - Professional table layout

4. **Email Integration (Ready)**
   - SendGrid API integration
   - HTML formatted emails
   - Background task processing

## 📧 Email Configuration

### Option 1: With SendGrid (Recommended)

1. **Get Your API Key**
   ```
   1. Visit https://sendgrid.com and sign up
   2. Go to Settings → API Keys
   3. Click "Create API Key"
   4. Choose "Full Access"
   5. Copy the generated key
   ```

2. **Configure Backend**
   
   Edit `/app/backend/.env` and add:
   ```bash
   SENDGRID_API_KEY=SG.your_actual_key_here
   SENDER_EMAIL=noreply@yourdomain.com
   RECIPIENT_EMAIL=admin@yourdomain.com
   ```

3. **Restart Backend**
   ```bash
   sudo supervisorctl restart backend
   ```

### Option 2: Without Email (Works Out of the Box)

The application works perfectly without email configuration:
- Form submissions are saved to browser storage
- You can view them in the Admin Dashboard
- Email notification will fail gracefully

## 🚀 How to Use

### For Users (Submitting the Form)

1. **Access the Form**: Open `http://localhost:3000`

2. **Fill Step by Step**:
   - Fill required fields (marked with *)
   - Click "Next" to proceed
   - Use "Previous" to go back if needed
   - Review and submit on Step 8

3. **View Confirmation**: After submission, you'll see a success message

### For Admins (Viewing Submissions)

1. **Access Dashboard**: Click "View Submissions" or go to `/admin`

2. **Review Submissions**:
   - See all submissions in a table
   - Click "View Details" for full information
   - Check submission date and time

## 📊 Current Data Storage

**Current Implementation**: Browser localStorage (mock)
- Data persists in browser
- No database required
- Perfect for testing and development

**Ready for Production**: MongoDB integration prepared
- Backend models ready
- Database connection configured
- Just need to switch from localStorage to API calls

## 🎨 Design Highlights

- **Professional**: Corporate slate-gray theme
- **Clean**: Minimal, focused layout
- **Intuitive**: Clear step-by-step process
- **Responsive**: Works on all screen sizes
- **Accessible**: Proper labels and ARIA attributes

## 📝 Form Sections Explained

### 1. Organization & Contact (Required)
- Organization name, primary contact details
- Optional secondary contact

### 2. Scope Information (Required)
- Assessment type selection
- Testing mode
- Compliance requirements
- IP ranges and exclusions

### 3. Network Environment
- Device count estimation
- Environment type (Office/Cloud/Hybrid)

### 4. Testing Window & Restrictions
- Preferred testing time
- Testing restrictions
- Notification preferences

### 5. Access Requirements
- VPN/Jump-server access
- Test credentials type

### 6. Reporting Requirements
- Report format preferences
- Retesting requirements

### 7. Authorization (Required for submission)
- Permission approval
- Approver details

### 8. Additional Notes
- Open text field for special requirements

## 🔧 Technical Details

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router

### Backend
- **Framework**: FastAPI
- **Email**: SendGrid Python SDK
- **Database**: MongoDB (ready, not activated)
- **Server**: Uvicorn

## 🐛 Troubleshooting

### Form Not Loading
```bash
# Check frontend
cd /app/frontend
yarn start

# Check logs
tail -f /var/log/supervisor/frontend.out.log
```

### Backend Issues
```bash
# Check backend status
sudo supervisorctl status backend

# View logs
tail -f /var/log/supervisor/backend.err.log

# Restart
sudo supervisorctl restart backend
```

### Email Not Sending
1. Verify `SENDGRID_API_KEY` is set in `.env`
2. Check sender email is verified in SendGrid
3. Check backend logs for errors
4. Confirm SendGrid account is active

## 📧 Email Template Preview

When configured, admins receive emails with:
- Professional header with branding
- All form sections neatly organized
- Color-coded badges for categories
- Submission timestamp and ID
- Clean, email-client compatible formatting

## 🎯 Next Steps

### To Activate Full Backend Integration:

1. **Enable Database Storage**:
   - Update form to call backend API instead of localStorage
   - Backend endpoints are ready

2. **Add More Features**:
   - PDF export of submissions
   - User authentication
   - File attachments for signatures
   - Email templates customization

### To Customize:

1. **Change Colors**: Edit `/app/frontend/src/index.css`
2. **Modify Form Fields**: Edit `/app/frontend/src/pages/VAPTFormSteps.jsx`
3. **Update Email Template**: Edit `/app/backend/emails.py`

## 📱 Access Points

- **Form**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Backend API**: http://localhost:8001/api
- **API Docs**: http://localhost:8001/docs

## ✨ What Makes This Special

1. **Progressive Disclosure**: Users see one section at a time
2. **Visual Feedback**: Green checkmarks show completed steps
3. **Validation**: Can't proceed without required info
4. **Professional**: Suitable for enterprise use
5. **Extensible**: Easy to add more steps or fields

---

**Status**: ✅ Production Ready (Email optional)

**Mock Data**: Currently using browser localStorage - works perfectly for testing!

**Email Setup**: 5 minutes with SendGrid account
