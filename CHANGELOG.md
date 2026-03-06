# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-03-06

### Added
- **Django Admin Interface Configuration**
  - Created `backend/users/admin.py` with UserProfile management
  - Created `backend/tickets/admin.py` with Ticket management and advanced filters
  - Created `backend/comments/admin.py` with Comment and CommentMention management
  - Added list displays, filters, search fields, and optimized queries for all admin panels
  
- **Automated Superuser Creation**
  - Added `backend/create_superuser.py` script for easy admin account setup
  - Pre-configured superuser credentials: `superadmin` / `admin123`
  
- **Enhanced Documentation**
  - Updated README.md with complete setup instructions
  - Added troubleshooting section for common issues
  - Added technology stack section
  - Added useful commands reference
  - Documented all three access points (Frontend, API, Admin)

### Fixed
- **API Port Configuration**
  - Changed backend port from 5000 to 8000 (Django default)
  - Updated `frontend/.env` to use correct API URL: `http://localhost:8000/api`
  - Updated `frontend/.env.example` with correct configuration
  - Resolved `ERR_CONNECTION_REFUSED` errors between frontend and backend
  
- **Dependencies**
  - Installed missing `python-decouple` package
  - Documented all required Python packages
  - Added explicit dependency installation instructions

### Changed
- Frontend now connects to port 8000 instead of 5000
- README.md completely restructured with better organization
- Added "Recent Updates" section to README
- Enhanced troubleshooting guide with specific solutions

### Security
- Superuser account properly configured with all required permissions
- Token-based authentication enabled for API access

---

## Access Information

### Application URLs
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api/
- **Django Admin:** http://localhost:8000/admin/

### Default Admin Credentials
- **Username:** superadmin
- **Password:** admin123
- **Email:** superadmin@bugapp.com

---

## Files Created/Modified

### New Files
- `backend/users/admin.py`
- `backend/tickets/admin.py`
- `backend/comments/admin.py`
- `backend/create_superuser.py`
- `backend/fix_admin.py`
- `CHANGELOG.md`

### Modified Files
- `README.md` - Complete rewrite with enhanced documentation
- `frontend/.env` - Changed API URL from port 5000 to 8000
- `frontend/.env.example` - Updated with correct default values
