# ClubDev: Your Personal Coding Journey Companion

![Build Status](https://img.shields.io/github/actions/workflow/status/bantoinese83/Club-Dev/ci.yml)
![License](https://img.shields.io/github/license/bantoinese83/Club-Dev)
![npm version](https://img.shields.io/npm/v/clubdevbase)
![GitHub contributors](https://img.shields.io/github/contributors/bantoinese83/Club-Dev)
![GitHub issues](https://img.shields.io/github/issues/bantoinese83/Club-Dev)
![GitHub pull requests](https://img.shields.io/github/issues-pr/bantoinese83/Club-Dev)

**Log your progress, connect with the community, and level up your coding skills with ClubDev!**

ClubDev is a platform built for developers to journal their coding adventures, track their progress, gain valuable insights through analytics, and connect with a vibrant community of fellow developers. Whether you're a seasoned coder or just starting your journey, ClubDev provides the tools and support you need to succeed.

## Key Features

- **Journaling:** Log your daily coding activities, challenges, and triumphs. Use the rich text editor to format your entries, add code snippets, and embed media.
- **Progress Tracking:** Visualize your coding journey with insightful analytics and charts. Track your coding streaks, levels, and achievements.
- **AI-Powered Assistance:** Leverage AI for writing assistance, code review, and programming chat. Get personalized recommendations and suggestions to improve your coding habits.
- **Community Feed:** Connect with other developers, share your experiences, and learn from each other. Explore the public feed, follow other users, and engage in discussions.
- **Gamification:** Earn points, unlock badges, and climb the leaderboard. Participate in community challenges and stay motivated on your coding journey.
- **Integrations:** Connect with popular developer tools like GitHub and Notion to seamlessly track your coding activities and projects.
- **Mind Map Generator:** Create and share interactive mind maps to visualize your ideas and projects.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/clubdev.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd clubdev
    ```

3. **Install the dependencies:**

    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL="your_database_url"
GOOGLE_AI_API_KEY="your_google_ai_api_key"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GITHUB_ID="your_github_id"
GITHUB_SECRET="your_github_secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
AWS_REGION="your_aws_region"
AWS_ACCESS_KEY_ID="your_aws_access_key_id"
AWS_SECRET_ACCESS_KEY="your_aws_secret_access_key"
AWS_S3_BUCKET_NAME="your_aws_s3_bucket_name"
EMAIL_SERVER_HOST="your_email_server_host"
EMAIL_SERVER_PORT="your_email_server_port"
EMAIL_SERVER_USER="your_email_server_user"
EMAIL_SERVER_PASSWORD="your_email_server_password"
EMAIL_FROM="your_email_from_address"
ELASTICSEARCH_NODE="your_elasticsearch_node"
ELASTICSEARCH_USERNAME="your_elasticsearch_username"
ELASTICSEARCH_PASSWORD="your_elasticsearch_password"
NEXT_PUBLIC_WEBSOCKET_URL="your_websocket_url"
NEXT_PUBLIC_APP_URL="your_app_url"
```

### Running Locally

1. **Start the development server:**

    ```bash
    npm run dev
    ``` 
   

## API Endpoints

<table>
  <thead>
    <tr>
      <th>API Endpoint</th>
      <th>Method</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>/api/achievements</td>
      <td>GET</td>
      <td>Fetch all achievements for the authenticated user</td>
    </tr>
    <tr>
      <td>/api/ai/chat</td>
      <td>POST</td>
      <td>Handle AI chat requests</td>
    </tr>
    <tr>
      <td>/api/ai/code-review</td>
      <td>POST</td>
      <td>Generate code review using AI</td>
    </tr>
    <tr>
      <td>/api/ai/generate-code</td>
      <td>POST</td>
      <td>Generate code using AI</td>
    </tr>
    <tr>
      <td>/api/ai/generate-mindmap</td>
      <td>POST</td>
      <td>Generate mind map using AI</td>
    </tr>
    <tr>
      <td>/api/ai/generate-prompt</td>
      <td>POST</td>
      <td>Generate prompt using AI</td>
    </tr>
    <tr>
      <td>/api/ai/programming-chat</td>
      <td>POST</td>
      <td>Handle programming chat requests using AI</td>
    </tr>
    <tr>
      <td>/api/ai/writing-assistant</td>
      <td>POST</td>
      <td>Handle writing assistant requests using AI</td>
    </tr>
    <tr>
      <td>/api/analytics</td>
      <td>GET</td>
      <td>Fetch analytics data</td>
    </tr>
    <tr>
      <td>/api/auth/[...nextauth]</td>
      <td>POST</td>
      <td>Handle authentication</td>
    </tr>
    <tr>
      <td>/api/auth/signup</td>
      <td>POST</td>
      <td>Handle user signup</td>
    </tr>
    <tr>
      <td>/api/categories</td>
      <td>GET</td>
      <td>Fetch all categories</td>
    </tr>
    <tr>
      <td>/api/challenges</td>
      <td>GET</td>
      <td>Fetch all challenges for the authenticated user</td>
    </tr>
    <tr>
      <td>/api/challenges</td>
      <td>POST</td>
      <td>Create a new challenge</td>
    </tr>
    <tr>
      <td>/api/challenges/:id</td>
      <td>PUT</td>
      <td>Update challenge completion status</td>
    </tr>
    <tr>
      <td>/api/create-checkout-session</td>
      <td>POST</td>
      <td>Create a new Stripe checkout session</td>
    </tr>
    <tr>
      <td>/api/entries/:id/comments</td>
      <td>POST</td>
      <td>Add a comment to an entry</td>
    </tr>
    <tr>
      <td>/api/entries/:id/flag</td>
      <td>POST</td>
      <td>Flag an entry</td>
    </tr>
    <tr>
      <td>/api/entries/:id/like</td>
      <td>POST</td>
      <td>Like an entry</td>
    </tr>
    <tr>
      <td>/api/entries/:id/peer-review</td>
      <td>POST</td>
      <td>Add a peer review to an entry</td>
    </tr>
    <tr>
      <td>/api/entries/:id/pinned</td>
      <td>POST</td>
      <td>Pin an entry</td>
    </tr>
    <tr>
      <td>/api/entries/:id/recent</td>
      <td>GET</td>
      <td>Fetch recent entries</td>
    </tr>
    <tr>
      <td>/api/gamification/leaderboard</td>
      <td>GET</td>
      <td>Fetch the leaderboard</td>
    </tr>
    <tr>
      <td>/api/gamification/update-points</td>
      <td>POST</td>
      <td>Update user points</td>
    </tr>
    <tr>
      <td>/api/gamification/user-data</td>
      <td>GET</td>
      <td>Fetch user gamification data</td>
    </tr>
    <tr>
      <td>/api/github/commits</td>
      <td>GET</td>
      <td>Fetch GitHub commits</td>
    </tr>
    <tr>
      <td>/api/github/repositories</td>
      <td>GET</td>
      <td>Fetch GitHub repositories</td>
    </tr>
    <tr>
      <td>/api/github/leaderboard</td>
      <td>GET</td>
      <td>Fetch GitHub leaderboard</td>
    </tr>
    <tr>
      <td>/api/mindmaps/:id/share</td>
      <td>POST</td>
      <td>Share a mind map</td>
    </tr>
    <tr>
      <td>/api/moderation</td>
      <td>POST</td>
      <td>Handle moderation requests</td>
    </tr>
    <tr>
      <td>/api/notifications</td>
      <td>GET</td>
      <td>Fetch user notifications</td>
    </tr>
    <tr>
      <td>/api/notion/pages</td>
      <td>GET</td>
      <td>Fetch Notion pages</td>
    </tr>
    <tr>
      <td>/api/recommendations</td>
      <td>GET</td>
      <td>Fetch recommendations</td>
    </tr>
    <tr>
      <td>/api/search</td>
      <td>GET</td>
      <td>Search entries</td>
    </tr>
    <tr>
      <td>/api/subscription/downgrade</td>
      <td>POST</td>
      <td>Downgrade user subscription</td>
    </tr>
    <tr>
      <td>/api/topic-clusters</td>
      <td>GET</td>
      <td>Fetch topic clusters</td>
    </tr>
    <tr>
      <td>/api/upload</td>
      <td>POST</td>
      <td>Handle file uploads</td>
    </tr>
    <tr>
      <td>/api/user/animation-preference</td>
      <td>GET</td>
      <td>Get the animation preference of the authenticated user</td>
    </tr>
    <tr>
      <td>/api/user/animation-preference</td>
      <td>POST</td>
      <td>Update the animation preference of the authenticated user</td>
    </tr>
    <tr>
      <td>/api/user/streak</td>
      <td>GET</td>
      <td>Fetch user streak data</td>
    </tr>
    <tr>
      <td>/api/users/:id/follow</td>
      <td>POST</td>
      <td>Follow a user</td>
    </tr>
    <tr>
      <td>/api/users/:id/profile</td>
      <td>GET</td>
      <td>Fetch user profile</td>
    </tr>
    <tr>
      <td>/api/users/:id/reputation</td>
      <td>GET</td>
      <td>Fetch user reputation</td>
    </tr>
    <tr>
      <td>/api/webhook</td>
      <td>POST</td>
      <td>Handle Stripe webhook events</td>
    </tr>
  </tbody>
</table>

## GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=bantoinese83&show_icons=true&theme=radical)
![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=bantoinese83&layout=compact&theme=radical)
![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=bantoinese83&theme=radical)
![GitHub Trophies](https://github-profile-trophy.vercel.app/?username=bantoinese83&theme=radical)
![GitHub Activity Graph](https://activity-graph.herokuapp.com/graph?username=bantoinese83&theme=react-dark)
![GitHub Contribution Graph]( https://ghchart.rshah.org/409ba5/bantoinese83)
![GitHub Readme Stats](https://github-readme-stats.vercel.app/api/pin/?username=bantoinese83&repo=Club-Dev&theme=radical)
