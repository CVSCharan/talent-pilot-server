import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IN8nUserResponse extends Document {
  user: IUser['_id'];
  jdContext: {
    jobDescription: string;
    jobDetails: {
      positionTitle: string;
      requiredSkills: string[];
      coreResponsibilities: string[];
      seniorityLevel: string;
      preferredLocation: string;
      minimumExperience: string;
      educationRequirement: string;
      bonusSkills: string[];
    };
  };
  candidateResume: {
    candidateDetails: {
      "Candidate Name": string;
      "Candidate Email": string;
      "Candidate Contact": string;
      Education: {
        Degree: string;
        Institution: string;
        "Graduation Year": string;
      }[];
      "Technical Skills": {
        "Programming Languages": string[];
        Frameworks: string[];
        Databases: string[];
        Tools: string[];
        Methodologies: string[];
      };
      Experience: {
        "Job Title": string;
        Company: string;
        "Start Date": string;
        "End Date": string;
        Responsibilities: string[];
        Achievements: string[];
      }[];
      Projects: {
        "Project Name": string;
        Objective: string;
        "Technologies Used": string[];
        Outcome: string;
      }[];
      "Certifications & Training": {
        Certification: string;
        "Issuing Organization": string;
        Year: string;
      }[];
      "Other Notable Information": {
        Awards: string[];
        Publications: string[];
        "Volunteer Work": string[];
        "Open Source Contributions": string[];
        Languages: string[];
      };
      "Resume Summary": string;
    };
  };
  results: {
    final_score: string;
    confidence_score: string;
    recommendation: string;
    justification: string;
    key_strengths: string[];
    key_gaps: string[];
    hard_blockers: string[];
  };
  createdAt: Date;
}

const N8nUserResponseSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jdContext: {
    jobDescription: { type: String, required: true },
    jobDetails: {
      positionTitle: { type: String, required: true },
      requiredSkills: { type: [String], required: true },
      coreResponsibilities: { type: [String], required: true },
      seniorityLevel: { type: String, required: true },
      preferredLocation: { type: String, required: true },
      minimumExperience: { type: String, required: true },
      educationRequirement: { type: String, required: true },
      bonusSkills: { type: [String], required: true },
    },
  },
  candidateResume: {
    candidateDetails: {
      "Candidate Name": { type: String, required: true },
      "Candidate Email": { type: String, required: true },
      "Candidate Contact": { type: String, required: true },
      Education: [{
        Degree: { type: String, required: true },
        Institution: { type: String, required: true },
        "Graduation Year": { type: String, required: true },
      }],
      "Technical Skills": {
        "Programming Languages": { type: [String], required: true },
        Frameworks: { type: [String], required: true },
        Databases: { type: [String], required: true },
        Tools: { type: [String], required: true },
        Methodologies: { type: [String], required: true },
      },
      Experience: [{
        "Job Title": { type: String, required: true },
        Company: { type: String, required: true },
        "Start Date": { type: String, required: true },
        "End Date": { type: String, required: true },
        Responsibilities: { type: [String], required: true },
        Achievements: { type: [String], required: true },
      }],
      Projects: [{
        "Project Name": { type: String, required: true },
        Objective: { type: String, required: true },
        "Technologies Used": { type: [String], required: true },
        Outcome: { type: String, required: true },
      }],
      "Certifications & Training": [{
        Certification: { type: String, required: true },
        "Issuing Organization": { type: String, required: true },
        Year: { type: String, required: true },
      }],
      "Other Notable Information": {
        Awards: { type: [String], required: true },
        Publications: { type: [String], required: true },
        "Volunteer Work": { type: [String], required: true },
        "Open Source Contributions": { type: [String], required: true },
        Languages: { type: [String], required: true },
      },
      "Resume Summary": { type: String, required: true },
    },
  },
  results: {
    final_score: { type: String, required: true },
    confidence_score: { type: String, required: true },
    recommendation: { type: String, required: true },
    justification: { type: String, required: true },
    key_strengths: { type: [String], required: true },
    key_gaps: { type: [String], required: true },
    hard_blockers: { type: [String], required: true },
  },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model<IN8nUserResponse>('N8nUserResponse', N8nUserResponseSchema);
