export interface MentorApplication {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  expertise: string;
  experience: string;
  bio: string;
  website: string;
  twitter: string;
  linkedin: string;
  resume: File | null;
  certificate: File | null;
  idProof: File | null;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}