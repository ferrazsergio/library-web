export interface CategoryStatisticsDTO {
    category: string;
    count: number;
}

export interface RecentActivityDTO {
    id: number;
    activityType: "LOAN" | "RETURN" | "NEW_BOOK" | string;
    description: string;
    timestamp: string; // ISO string
    userName: string;
    bookTitle: string;
}

export interface DashboardDataDTO {
    totalBooks: number;
    totalLoans: number;
    activeLoans: number;
    overdueLoans: number;
    totalUsers: number;
    mostBorrowedCategories: CategoryStatisticsDTO[];
    recentActivities: RecentActivityDTO[];
}