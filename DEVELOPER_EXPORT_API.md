# KaoJob Developer Export API

The Developer Export feature allows you to export job data in various formats for integration with external services, APIs, and bots.

## Access the Export Tool

Visit `/dev-export.html` to access the developer export interface.

## Export Formats

### 1. API Format (Clean)
```json
{
  "success": true,
  "data": [
    {
      "id": "job_123",
      "title": "Software Developer",
      "description": "We are looking for...",
      "company": "Tech Corp",
      "location": "Bangkok",
      "workType": "Full-time",
      "salary": "50000-70000",
      "contactEmail": "hr@techcorp.com",
      "status": "Active",
      "datePosted": "2024-09-24T10:00:00.000Z",
      "applicationCount": 5
    }
  ],
  "total": 1,
  "timestamp": "2024-09-24T15:30:00.000Z"
}
```

### 2. Line Bot Format
```json
{
  "type": "flex",
  "altText": "Job Opportunities Available",
  "contents": {
    "type": "carousel",
    "contents": [
      {
        "type": "bubble",
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Software Developer",
              "weight": "bold",
              "size": "xl",
              "color": "#1DB584"
            }
          ]
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "spacing": "md",
          "contents": [...]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "spacing": "sm",
          "contents": [
            {
              "type": "button",
              "style": "primary",
              "height": "sm",
              "action": {
                "type": "postback",
                "label": "Apply Now",
                "data": "action=apply&jobId=job_123"
              }
            }
          ]
        }
      }
    ]
  }
}
```

### 3. Raw Database Format
The original database format with all fields preserved.

### 4. CSV Format
Comma-separated values format suitable for spreadsheets and data analysis.

## Filtering Options

- **Job Status**: All, Active, Closed, Draft
- **Location**: All locations or specific cities
- **Work Type**: All types or specific work arrangements

## Usage Examples

### Line Bot Integration
```javascript
// In your Line Bot webhook handler
const jobs = await fetch('your-api-endpoint/jobs').then(r => r.json());
const flexMessage = transformToLineBotFormat(jobs);

await client.replyMessage(event.replyToken, flexMessage);
```

### REST API Usage
```javascript
// Fetch jobs with filters
const response = await fetch('/api/jobs?status=Active&location=Bangkok');
const jobData = await response.json();

if (jobData.success) {
  console.log(`Found ${jobData.total} jobs`);
  jobData.data.forEach(job => {
    console.log(`${job.title} at ${job.company}`);
  });
}
```

### Webhook Integration
```javascript
// Example webhook payload
{
  "event": "job_created",
  "data": {
    "id": "job_123",
    "title": "Software Developer",
    "company": "Tech Corp",
    "status": "Active"
  },
  "timestamp": "2024-09-24T15:30:00.000Z"
}
```

## Features

- **Live Preview**: See the export format before downloading
- **Multiple Formats**: JSON, CSV, Line Bot Flex Messages
- **Filtering**: Export only the jobs you need
- **Statistics**: View job count, applications, and employer data
- **One-Click Download**: Export directly to files
- **Copy to Clipboard**: Quick copy for testing
- **Mock API Generator**: Generate test endpoints

## Integration Tips

1. **Line Bot**: Use the Line Bot format for rich card displays
2. **REST API**: Use the API format for clean, standardized responses  
3. **Data Analysis**: Use CSV format for spreadsheets and analytics
4. **Development**: Use Raw format when you need all original data

## API Endpoints (Future)

When deploying to a server, you can create these endpoints:

- `GET /api/jobs` - Get all jobs
- `GET /api/jobs?status=Active` - Filter by status
- `GET /api/jobs?location=Bangkok` - Filter by location
- `GET /api/jobs/{id}` - Get specific job
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job

## Security Considerations

- Always validate input parameters
- Implement rate limiting
- Use authentication for write operations
- Sanitize exported data for public APIs
- Consider CORS settings for web apps

## Contact

For technical support or feature requests, please contact the development team.