import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

export interface IN8nUserResponse extends Document {
  user: IUser["_id"];
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

const N8nUserResponseSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jdContext: {
      jobDescription: { type: String, required: false },
      jobDetails: {
        positionTitle: { type: String, required: false },
        requiredSkills: { type: [String], required: false },
        coreResponsibilities: { type: [String], required: false },
        seniorityLevel: { type: String, required: false },
        preferredLocation: { type: String, required: false },
        minimumExperience: { type: String, required: false },
        educationRequirement: { type: String, required: false },
        bonusSkills: { type: [String], required: false },
      },
    },
    candidateResume: {
      candidateDetails: {
        "Candidate Name": { type: String, required: false },
        "Candidate Email": { type: String, required: false },
        "Candidate Contact": { type: String, required: false },
        Education: [
          {
            Degree: { type: String, required: false },
            Institution: { type: String, required: false },
            "Graduation Year": { type: String, required: false },
          },
        ],
        "Technical Skills": {
          "Programming Languages": { type: [String], required: false },
          Frameworks: { type: [String], required: false },
          Databases: { type: [String], required: false },
          Tools: { type: [String], required: false },
          Methodologies: { type: [String], required: false },
        },
        Experience: [
          {
            "Job Title": { type: String, required: false },
            Company: { type: String, required: false },
            "Start Date": { type: String, required: false },
            "End Date": { type: String, required: false },
 },
        ],
        Projects: [
          {
            "Project Name": { type: String, required: false },
            Objective: { type: String, required: false },
            "Technologies Used": { type: [String], required: false },
            Outcome: { type: String, required: false },
          },
        ],
        "Certifications & Training": [
          {
            Certification: { type: String, required: false },
            "Issuing Organization": { type: String, required: false },
            Year: { type: String, required: false },
          },
        ],
        "Other Notable Information": {
          Awards: { type: [String], required: false },
          Publications: { type: [String], required: false },
          "Volunteer Work": { type: [String], required: false },
          "Open Source Contributions": { type: [String], required: false },
          Languages: { type: [String], required: false },
        },
        "Resume Summary": { type: String, required: false },
      },
    },
    results: {
      final_score: { type: String, required: false },
      confidence_score: { type: String, required: false },
      recommendation: { type: String, required: false },
      justification: { type: String, required: false },
      key_strengths: { type: [String], required: false },
      key_gaps: { type: [String], required: false },
      hard_blockers: { type: [String], required: false },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IN8nUserResponse>(
  "N8nUserResponse",
  N8nUserResponseSchema
);
