import request from 'supertest';
import express from 'express';
import n8nRoutes from './n8nRoutes';
import { n8nService } from '../services/n8nService';
import N8nUserResponse from '../models/N8nUserResponse';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

// Mock the dependencies
jest.mock('../config/logger');

const mockSave = jest.fn();
jest.mock('../models/N8nUserResponse', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    save: mockSave,
  })),
}));

(N8nUserResponse as any).countDocuments = jest.fn();

const app = express();
app.use(express.json());

// Minimal passport setup for testing
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'test-secret',
};

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    done(null, { _id: jwt_payload.sub });
  })
);

app.use(passport.initialize());
app.use('/api/n8n', n8nRoutes);

// Add a generic error handler to the test app to prevent crashing on multer errors
app.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    res.status(500).send(err.message);
  } else {
    next();
  }
});

describe('N8N Routes', () => {
  let token: string;
  const userId = new mongoose.Types.ObjectId().toString();
  let sendToWebhookSpy: jest.SpyInstance;

  beforeAll(() => {
    token = jwt.sign({ sub: userId }, 'test-secret');
  });

  beforeEach(() => {
    sendToWebhookSpy = jest.spyOn(n8nService, 'sendToWebhook').mockResolvedValue([
      {
  "jdContext": {
    "jobDescription": "The QA SDET role is tailored for candidates with a minimum of 4 years of experience in the IT industry. This position requires strong programming skills in Python, specifically utilizing the pytest framework for automated testing. Candidates must excel in designing test cases, have hands-on experience with Jupyter Notebooks for scripting, and possess expertise in Agile methodologies. Proficiency in testing both web (Angular) and mobile (React Native) applications is also essential. This role demands a solid understanding of cloud-hosted software and RESTful APIs, as well as practical SQL knowledge. Preferred candidates will have experience with version control tools like Git, as well as working knowledge of CI/CD processes using tools such as JIRA, Bitbucket, and Confluence. Effective communication skills are crucial, particularly for collaborating within a global team. While the role is based in Hyderabad, a proactive attitude and the ability to thrive in a startup environment will mark a candidate for success. Additional knowledge of IoT technologies and time series databases is considered a bonus. The candidate's primary success factors will be their proven abilities to implement the core responsibilities and display required skills, with bonus skills and educational background being secondary considerations.",
    "jobDetails": {
      "positionTitle": "QA SDET",
      "requiredSkills": ["Python (Pytest framework)","Automation scripting with Jupyter Notebooks","Testing web and mobile applications (Angular, React Native)","SQL","CI/CD processes","Communication skills"],
      "coreResponsibilities": ["Understand requirements and develop test cases.","Apply Agile methodologies.","Work with cloud-hosted software and RESTful APIs.","Execute testing for web and mobile applications.","Develop and maintain automated test scripts.","Set up and manage CI/CD pipelines.","Collaborate with global teams."],
      "seniorityLevel": "Junior",
      "preferredLocation": "Hyderabad",
      "minimumExperience": "4",
      "educationRequirement": "ANY",
      "bonusSkills": ["IoT technologies","Time series database knowledge"]
    }
  },
  "candidateResume": {
    "candidateDetails": {
      "Candidate Name": "C V S Charan",
      "Candidate Email": "charan.cvs@gmail.com",
      "Candidate Contact": "+91 7337525111",
      "Education": [{"Degree":"Research Fellowship, Teaching Assistantship - Physics (Solar Cells / HEA)","Institution":"Mahindra University, Hyderabad","Graduation Year":"2022"},{"Degree":"MS/MSc (Master of Science) - Physics","Institution":"VIT University, Vellore","Graduation Year":"2021"},{"Degree":"Full Stack Web Development (Learning 4.0 Technologies)","Institution":"NxtWave’s CCBP 4.0 Intensive, Hyderabad","Graduation Year":"2022"}],
      "Technical Skills": {"Programming Languages":["JavaScript","Python","TypeScript"],"Frameworks":["React JS","Node JS","Next JS","Bootstrap","Tailwind CSS"],"Databases":["PostgreSQL","MySQL","Snowflake","MongoDB","SQLite"],"Tools":["Azure","AWS","Railway","Vercel","Render","Git","Zapier","n8n","Power Platform(BI, Automate, Apps)","Databricks"],"Methodologies":["Agile (Scrum)"]},
      "Experience": [{"Job Title":"Freelance Web and Mobile Developer","Company":"Self-employed","Start Date":"July 2024","End Date":"Present","Responsibilities":["Created and deployed intelligent static and dynamic web apps and mobile apps integrating AI and scalable infrastructure.","Built NLP-powered resume evaluation tools and RAG-based chatbots using OpenAI and custom logic.","Deployed production-ready applications on platforms like Vercel, Render, and Railway."],"Achievements":["Integrated LLMs for real-time intelligent responses.","Designed Swamy’s Hot Foods Admin App featuring QR-based digital menus."]},{"Job Title":"Software Developer Inter","Company":"Assetmonk Private Properties LTD, Hyderabad","Start Date":"June 2022","End Date":"July 2022","Responsibilities":["Developed application screens including user authentication.","Implemented data management solutions using React Native and Redux.","Worked on Power BI projects enhancing data storytelling and visualization."],"Achievements":["Contributed to project 'Praan' for session management for caregivers.","Developed solutions integrating Tableau and Power BI."]},{"Job Title":"Data Analytics Engineer","Company":"Providence Global Center LLP, Hyderabad","Start Date":"September 2022","End Date":"June 2024","Responsibilities":["Engineered data-driven solutions and full-stack applications for a healthcare organization.","Built scalable data pipelines and interactive Power BI dashboards.","Collaborated on Agile execution and cross-functional team efforts."],"Achievements":["Reduced data retrieval times by 40% in backend systems.","Improved application downtime by 30% through integrated monitoring solutions."]}],
      "Projects": [{"Project Name":"AI Resume Screener","Objective":"To evaluate resumes using NLP and scalable automation.","Technologies Used":["OpenAI","n8n"],"Outcome":"Automated resume parsing for smarter evaluations."},{"Project Name":"RAG Chatbot for Q&A","Objective":"To provide accurate and context-aware answers using RAG architecture.","Technologies Used":["OpenAI","Pinecone"],"Outcome":"Improved workflow with intelligent chat responses."},{"Project Name":"Swamy’s Hot Foods Admin App","Objective":"To enhance restaurant operations through a digital interface.","Technologies Used":["React.js","React Native","MongoDB","AWS"],"Outcome":"Provided real-time control of shop status and menu content."}],
      "Certifications & Training": [{"Certification":"Introduction to Agile Development and Scrum","Issuing Organization":"IBM","Year":"2023"},{"Certification":"Prompt Engineering for ChatGPT","Issuing Organization":"Vanderbilt University","Year":"2023"},{"Certification":"Build Dynamic User Interfaces (UI) for Websites","Issuing Organization":"Google","Year":"2023"},{"Certification":"Build Your Own Responsive Website","Issuing Organization":"NxtWave","Year":"2022"},{"Certification":"Build Your Own Static Website","Issuing Organization":"NxtWave","Year":"2022"},{"Certification":"Node.js","Issuing Organization":"NxtWave","Year":"2022"},{"Certification":"Developer Foundations","Issuing Organization":"NxtWave","Year":"2022"},{"Certification":"Introduction to Databases","Issuing Organization":"NxtWave","Year":"2022"},{"Certification":"JavaScript Essentials","Issuing Organization":"NxtWave","Year":"2022"},{"Certification":"Responsive Web Design using Flexbox","Issuing Organization":"NxtWave","Year":"2022"}],
      "Other Notable Information": {"Awards":[],"Publications":[],"Volunteer Work":[],"Open Source Contributions":[],"Languages":[]},
      "Resume Summary": "AI-Augmented Full-Stack Developer with a foundation in Data Analytics, specialized in building scalable AI-driven web and mobile applications. Experienced in incorporating LLMs and integrating OpenAI APIs for dynamic solutions. Proficient in transforming business needs into user experiences using modern cloud tools and frameworks like React and Node.js."
    }
  },
  "results": {
    "final_score": "63",
    "confidence_score": "90",
    "recommendation": "No",
    "justification": "The candidate demonstrates a solid educational background and proficiency in several relevant skills. However, critical technical requirements such as expertise in the Pytest framework and Jupyter Notebooks are not met, which are essential per the JD. With experience slightly below the required level and a lack of direct SDET roles, the candidate is not fully aligned with the job requirements. Consequently, despite the potential in other areas, these hard blockers force a conclusion that the candidate does not fulfill the necessary criteria for the role.",
    "key_strengths": ["Advanced education in relevant fields","Proficiency in Python and SQL","Experience developing application screens using React Native","Familiarity with Agile methodologies and CI/CD tools","Skills in Azure and AI development"],
    "key_gaps": ["Missing Pytest framework and Jupyter Notebooks experience","Less than 4 years of directly analogous experience","Lacking direct SDET roles or testing-focused experience","No explicit DevOps practices mentioned"],
    "hard_blockers": ["Missing evidence for Pytest framework and Jupyter Notebooks"]
  }
}
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockSave.mockClear();
    sendToWebhookSpy.mockRestore();
  });

  it('should return 200 on successful webhook call', async () => {
    (N8nUserResponse as any).countDocuments.mockResolvedValue(0);
    mockSave.mockResolvedValue({});

    const res = await request(app)
      .post('/api/n8n')
      .set('Authorization', `Bearer ${token}`)
      .attach('document', Buffer.from('test file content'), {
        filename: 'test.txt',
        contentType: 'text/plain',
      });

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(mockSave).toHaveBeenCalledTimes(1);
  }, 10000);

  it('should return 429 if user has reached the request limit', async () => {
    (N8nUserResponse as any).countDocuments.mockResolvedValue(2);

    const res = await request(app)
      .post('/api/n8n')
      .set('Authorization', `Bearer ${token}`)
      .attach('document', Buffer.from('test file content'), 'test.txt');

    expect(res.status).toBe(429);
    expect(res.text).toBe('You have reached the maximum number of requests.');
  });

  it('should return 400 if no file is uploaded', async () => {
    const res = await request(app)
      .post('/api/n8n')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.text).toBe('No file uploaded.');
  });

  it('should return 500 for invalid file type', async () => {
    const res = await request(app)
      .post('/api/n8n')
      .set('Authorization', `Bearer ${token}`)
      .attach('document', Buffer.from('test file content'), {
        filename: 'test.jpg',
        contentType: 'image/jpeg',
      });

    expect(res.status).toBe(500);
    expect(res.text).toContain('Invalid file type');
  });
});
