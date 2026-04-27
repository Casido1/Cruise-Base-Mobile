export interface OnboardingSchedule {
    id: string;
    userId: string;
    date: string;
    time: string;
    additionalNotes?: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
    createdOn: string;
}

export interface CreateOnboardingScheduleRequest {
    userId: string;
    date: string;
    time: string;
    additionalNotes?: string;
}
