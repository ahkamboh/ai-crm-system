# AI CRM System  

An advanced Customer Relationship Management (CRM) system with multi-channel communication, role-based access, and AI-powered automation. Manage customer queries, track sales, and handle appointments efficiently, all in one platform.  
At @infinitywaves while working I built this.

![image](https://github.com/user-attachments/assets/f18ef827-0854-4ee3-8c62-ee3b7c0fc7f0)

## Features  

- 🤖 **AI-Powered Insights**  
  - Customer behavior analysis  
  - Predictive sales forecasting  
  - Task automation recommendations  

- 💬 **Multi-Channel Communication**  
  - Seamlessly integrate with Instagram, WhatsApp, Facebook, and chat platforms  
  - Unified inbox for managing customer interactions  

- 📊 **Interactive Dashboard**  
  - Real-time analytics  
  - Performance metrics  
  - Customer activity tracking  

- 👥 **Role-Based Access**  
  - Admin: Manage users, roles, and settings  
  - Manager: Oversee agents and analyze reports  
  - Agent: Handle customer queries and interactions  

- 📈 **Sales Pipeline Management**  
  - Track deals and progress  
  - Revenue forecasting  
  - Sales performance metrics  

- 📅 **Appointment Scheduling**  
  - AI-assisted scheduling  
  - Automated follow-ups  

- 🔍 **Query Management**  
  - Track and prioritize customer queries  
  - Resolve tickets efficiently  

- 🔒 **Secure Authentication**  
  - NextAuth.js integration  

## Tech Stack  

- **Frontend:** Next.js 14 with App Router  
- **Styling:** Tailwind CSS + Shadcn/ui  
- **Backend:** Node.js (Express.js) + Heroku  
- **Database:** Vercel Postgres  
- **Authentication:** NextAuth.js  
- **AI Integration:** OpenAI API  
- **Deployment:** Vercel (frontend) and Heroku (backend)  

## Getting Started  

### Prerequisites  

- Node.js 18+  
- npm/pnpm/yarn  
- PostgreSQL database  

### Installation  

1. Clone the repository:  
```bash
git clone https://github.com/ahkamboh/ai-crm-system.git  
cd ai-crm-system  
```  

2. Install dependencies:  
```bash
npm install  
# or  
pnpm install  
```  

3. Set up environment variables:  
```bash
cp .env.example .env  
```  

Fill in your `.env` file with:  
```plaintext
# Database  
POSTGRES_URL=your_database_url  

# Authentication  
NEXTAUTH_URL=http://localhost:3000  
NEXTAUTH_SECRET=your_secret  

# OpenAI  
OPENAI_API_KEY=your_api_key  

# Social Media API Keys  
INSTAGRAM_API_KEY=your_instagram_api_key  
WHATSAPP_API_KEY=your_whatsapp_api_key  
FACEBOOK_API_KEY=your_facebook_api_key  
```  

4. Run the development server:  
```bash
npm run dev  
# or  
pnpm dev  
```  

Visit [http://localhost:3000](http://localhost:3000) to see your application.  

## Project Structure  

```plaintext
ai-crm-system/  
├── app/  
│   ├── (auth)/  
│   ├── (dashboard)/  
│   ├── api/  
│   └── layout.tsx  
├── components/  
│   ├── ui/  
│   └── shared/  
├── lib/  
│   ├── utils.ts  
│   └── db.ts  
├── public/  
└── styles/  
```  

## Key Features Explained  

### Multi-Channel Communication  
- Manage Instagram, WhatsApp, Facebook, and other chat interactions on a single platform.  
- Unified query tracking and resolution.  

### Role-Based Access  
- **Admin:** Full control over users, roles, and platform settings.  
- **Manager:** Supervises agents, monitors performance, and generates reports.  
- **Agent:** Handles customer interactions and resolves tickets.  

### Query Management  
- Automate query assignment based on priority.  
- Monitor response times and query status.  

## Development Guidelines  

- Follow the [Next.js best practices](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts).  
- Use TypeScript for type safety.  
- Implement responsive design.  
- Write unit tests for critical functions.  
- Follow [Conventional Commits](https://www.conventionalcommits.org/).  

## Deployment  

### Frontend (Vercel)  
1. Push your code to GitHub.  
2. Connect your repository to Vercel.  
3. Configure environment variables.  
4. Deploy!  

### Backend (Heroku)  
1. Create a new Heroku app.  
2. Set up environment variables.  
3. Push your backend code to Heroku.  
4. Deploy!  

## Contributing  

1. Fork the repository.  
2. Create your feature branch (`git checkout -b feature/amazing-feature`).  
3. Commit your changes (`git commit -m 'Add some amazing feature'`).  
4. Push to the branch (`git push origin feature/amazing-feature`).  
5. Open a Pull Request.  

## License  

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.  

## Support  

For support, please:  
- Open an [issue](https://github.com/ahkamboh/ai-crm-system/issues)  
- Contact: [your-email@example.com]  

## Acknowledgments  

- [Next.js](https://nextjs.org/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [Shadcn/ui](https://ui.shadcn.com/)  
- [OpenAI](https://openai.com/)  

---  

Built with ❤️ by [ahkamboh](https://github.com/ahkamboh)  

Let me know if you’d like any additional refinements! 🚀
