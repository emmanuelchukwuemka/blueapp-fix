# Backend Integration Guide: MyFigPoint Web + BluePoint Mobile

## Overview

This document outlines how to integrate the existing Flask-based backend to serve both the MyFigPoint web application and the BluePoint mobile application, ensuring a unified experience with shared user accounts, points system, tasks, and other features.

## Current Backend Architecture

The existing MyFigPoint backend is built with:
- **Framework**: Flask
- **Database**: SQLAlchemy ORM with SQLite/PostgreSQL
- **Authentication**: JWT tokens
- **Models**: User, Task, Transaction, RewardCode, etc.
- **API Endpoints**: RESTful API under `/api/` namespace

## Unified Backend Strategy

### 1. Single Source of Truth
- Maintain one centralized database that serves both applications
- Use the same User, Task, Transaction, and other core models
- Implement API endpoints that both web and mobile apps can consume

### 2. API-First Approach
- Expose all functionality through well-documented REST APIs
- Ensure APIs are platform-agnostic (no web-specific or mobile-specific logic)
- Implement proper CORS handling for web app access

### 3. Authentication Synchronization
- Use JWT tokens for both web and mobile authentication
- Same login credentials work across both platforms
- Implement refresh token mechanism for mobile app sessions
- Share user session state between platforms

## Database Schema Considerations

The existing models should remain largely unchanged, but with some enhancements:

### User Model
```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(UserRole), default=UserRole.USER, nullable=False)
    phone = db.Column(db.String(20))
    points_balance = db.Column(db.Float, default=0.0)
    total_points_earned = db.Column(db.Float, default=0.0)
    total_earnings = db.Column(db.Float, default=0.0)
    is_verified = db.Column(db.Boolean, default=False)
    avatar_url = db.Column(db.Text)  # For profile pictures
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # Additional fields for mobile app compatibility
    device_tokens = db.Column(db.JSON)  # For push notifications
    last_login_mobile = db.Column(db.DateTime)  # Track mobile usage
```

### Task Model
```python
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    reward_amount = db.Column(db.Float, default=0.0)  # USD value
    points_reward = db.Column(db.Integer, default=0)  # Points value
    category = db.Column(db.String(50), default='General')
    time_required = db.Column(db.Integer, default=0)  # in minutes
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # Fields for cross-platform compatibility
    is_mobile_friendly = db.Column(db.Boolean, default=True)
    estimated_completion_time = db.Column(db.Integer)  # in seconds
```

## API Endpoint Design

### Authentication Endpoints (Shared)
- `POST /api/auth/register` - User registration (works for both)
- `POST /api/auth/login` - Login (returns same JWT for both apps)
- `GET /api/auth/profile` - Get user profile (same data structure)
- `PUT /api/auth/profile` - Update profile (shared between apps)

### Points Management Endpoints (Shared)
- `GET /api/points/balance` - Get user points balance
- `GET /api/points/history` - Get points transaction history
- `POST /api/points/convert` - Convert points to cash (web only - may differ for mobile)

### Task Management Endpoints (Shared)
- `GET /api/tasks/` - Get available tasks (same for both apps)
- `POST /api/tasks/{id}/start` - Start a task
- `POST /api/tasks/{id}/complete` - Complete a task (includes proof for verification)
- `GET /api/tasks/categories` - Get task categories

### Referral System Endpoints (Shared)
- `GET /api/referrals/stats` - Get referral statistics
- `GET /api/referrals/link` - Get user's referral link
- `GET /api/referrals/history` - Get referral activity

## Cross-Platform Feature Implementation

### 1. Task Synchronization
- Admins upload tasks through the web admin panel
- Tasks are stored in the database with `is_active` status
- Both web and mobile apps fetch active tasks from the same API endpoint
- Task completion updates are reflected in real-time across platforms

### 2. Points System Integration
- Points earned on either platform are immediately reflected in both
- Transaction history is unified across platforms
- Points balances are synchronized in real-time
- Withdrawal requests initiated on one platform are visible on the other

### 3. User Profile Synchronization
- Profile updates on one platform are immediately visible on the other
- Avatar uploads are stored centrally and accessible to both apps
- Referral links and statistics are shared

## Implementation Strategy

### Phase 1: API Enhancement
1. Audit existing API endpoints for mobile compatibility
2. Add mobile-specific fields to existing models where needed
3. Implement proper error handling and response formatting
4. Add rate limiting and security measures for mobile usage

### Phase 2: Mobile API Endpoints
1. Create endpoints optimized for mobile data usage
2. Implement image upload endpoints for mobile proof submissions
3. Add push notification integration
4. Optimize response payloads for mobile bandwidth

### Phase 3: Authentication Integration
1. Ensure JWT tokens work seamlessly across platforms
2. Implement refresh token mechanism for mobile
3. Add social login options if needed
4. Implement single sign-on capabilities

### Phase 4: Data Synchronization
1. Implement WebSocket connections for real-time updates (optional)
2. Create background jobs for data consistency checks
3. Add caching layers for improved performance
4. Implement proper logging and monitoring

## Security Considerations

### API Security
- Rate limiting to prevent abuse
- Input validation for all endpoints
- Proper authentication checks on all sensitive operations
- SQL injection prevention through ORM usage

### Mobile-Specific Security
- Secure token storage recommendations for mobile
- Device registration and management
- Biometric authentication support
- Secure communication protocols

## Performance Optimization

### Caching Strategy
- Cache frequently accessed data (tasks, user profiles)
- Implement Redis for session management
- Use CDN for static assets and images
- Optimize database queries with proper indexing

### Mobile Optimization
- Compress API responses for mobile bandwidth
- Implement pagination for large datasets
- Optimize images for mobile consumption
- Use efficient data formats (JSON)

## Deployment Strategy

### Backend Deployment
- Deploy Flask app on scalable infrastructure (AWS, GCP, or Heroku)
- Use Gunicorn for production WSGI server
- Implement load balancing for high availability
- Set up proper logging and monitoring

### Database Scaling
- Migrate from SQLite to PostgreSQL for production
- Implement database read replicas for scaling
- Use connection pooling
- Regular backup and maintenance procedures

## Testing Strategy

### Integration Testing
- Test API endpoints with both web and mobile clients
- Verify data consistency across platforms
- Test authentication flow from both ends
- Validate real-time updates and synchronization

### Performance Testing
- Load testing for concurrent users
- Mobile-specific performance testing
- Database performance under load
- API response time optimization

## Migration Path

### From Current State
1. Analyze existing codebase for compatibility
2. Identify API endpoints that need modification
3. Update models to support mobile features
4. Test integration with mobile app API calls
5. Gradually roll out to production

### Backward Compatibility
- Maintain existing web app functionality
- Ensure no disruption to current users
- Implement new features alongside existing ones
- Provide clear API versioning

## Monitoring and Maintenance

### Logging
- Comprehensive API request logging
- Error tracking and reporting
- Performance metrics collection
- User activity monitoring

### Analytics
- Cross-platform user behavior analysis
- Feature usage statistics
- Performance monitoring
- Error tracking and resolution

## Conclusion

This unified backend approach will enable seamless operation between the MyFigPoint web application and the BluePoint mobile app. Users will enjoy a consistent experience regardless of the platform they use, with all their data, points, tasks, and achievements synchronized in real-time. The implementation leverages the existing robust Flask backend while extending it to meet mobile application requirements.