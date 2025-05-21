export interface Duration {
  id: string;
  duration: string; // E.g., "2 hours", "Full day", "3 days / 2 nights"
}

export interface CreateDurationDTO {
  duration: string;
}

export interface UpdateDurationDTO {
  duration: string;
}