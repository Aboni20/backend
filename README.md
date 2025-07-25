# ITM Summit Backend

Express.js backend API for the ITM Summit 2025 registration system.

## Setup Instructions

### 1. Environment Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update the `.env` file with your Supabase credentials:

```env
PORT=4000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

Development mode (with auto-restart):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will run on `http://localhost:4000` by default.

## API Endpoints

### Health Check

- **GET** `/health` - Check server status

### Registration

- **GET** `registration/status/:registrationId` - Get registration status by ID
- **GET** `registration/all` - Get all registrations (admin)
- **POST** `registration` - Create new registration

## Features

- ✅ Express.js server with proper middleware
- ✅ Supabase integration with service role key
- ✅ Input validation with Joi
- ✅ Error handling middleware
- ✅ CORS configuration for frontend
- ✅ Rate limiting
- ✅ Security headers with Helmet
- ✅ Structured logging

## Project Structure

```
itm-summit-backend/
├── index.js                 # Main server file
├── lib/
│   └── supabase.js          # Supabase client configuration
├── middleware/
│   └── errorHandler.js      # Global error handling
├── routes/
│   └── registration.js      # Registration API routes
├── services/
│   └── registrationService.js # Business logic for registrations
├── validation/
│   └── schemas.js           # Input validation schemas
└── package.json
```

## Environment Variables

| Variable                    | Description                          | Required |
| --------------------------- | ------------------------------------ | -------- |
| `PORT`                      | Server port (default: 4000)          | No       |
| `NODE_ENV`                  | Environment (development/production) | No       |
| `SUPABASE_URL`              | Supabase project URL                 | Yes      |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key            | Yes      |

## Testing the API

### Health Check

```bash
curl http://localhost:4000/health
```

### Get Registration Status

```bash
curl http://localhost:4000/registration/status/ITMS2025-1234
```

## Development

1. Make sure you have Node.js installed (v16 or higher)
2. Copy `.env.example` to `.env` and fill in your Supabase credentials
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server
5. The server will automatically restart when you make changes

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use `npm start` to run the server
3. Consider using a process manager like PM2 for production deployments
4. Set up proper logging and monitoring
