import { 
  users, activities, companies, notifications,
  type User, type InsertUser,
  type Activity, type InsertActivity,
  type Company, type InsertCompany,
  type Notification, type InsertNotification,
  type BurnoutSymptoms
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getUsersWithHighestBurnout(limit: number): Promise<User[]>;
  
  // Company methods
  getCompany(id: number): Promise<Company | undefined>;
  getCompanyByCode(code: string): Promise<Company | undefined>;
  getAllCompanies(): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<Company>): Promise<Company | undefined>;
  
  // Notification methods
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  
  // Activity methods
  getActivities(limit: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  getUserActivities(userId: number, limit: number): Promise<Activity[]>;
  
  // Burnout methods
  getBurnoutSymptoms(userId: number): Promise<BurnoutSymptoms | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private companies: Map<number, Company>;
  private notifications: Map<number, Notification>;
  private activities: Map<number, Activity>;
  private burnoutSymptoms: Map<number, BurnoutSymptoms>;
  private userIdCounter: number;
  private companyIdCounter: number;
  private notificationIdCounter: number;
  private activityIdCounter: number;

  constructor() {
    this.users = new Map();
    this.companies = new Map();
    this.notifications = new Map();
    this.activities = new Map();
    this.burnoutSymptoms = new Map();
    this.userIdCounter = 1;
    this.companyIdCounter = 1;
    this.notificationIdCounter = 1;
    this.activityIdCounter = 1;
    
    // Seed initial data
    this.seedCompanies();
  }

  // USER METHODS
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const joinedAt = new Date();
    const user: User = { ...insertUser, id, joinedAt };
    this.users.set(id, user);
    
    // Create default burnout symptoms
    this.burnoutSymptoms.set(id, {
      mentalExhaustion: Math.floor(Math.random() * 40) + 50, // 50-90
      workCynicism: Math.floor(Math.random() * 40) + 50, // 50-90
      sundayAnxiety: Math.floor(Math.random() * 40) + 50, // 50-90
      productivity: Math.floor(Math.random() * 30) + 30, // 30-60
    });
    
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUsersWithHighestBurnout(limit: number): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.burnoutScore - a.burnoutScore)
      .slice(0, limit);
  }
  
  // COMPANY METHODS
  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async getCompanyByCode(code: string): Promise<Company | undefined> {
    return Array.from(this.companies.values()).find(
      (company) => company.code === code,
    );
  }

  async getAllCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.companyIdCounter++;
    const company: Company = { ...insertCompany, id };
    this.companies.set(id, company);
    return company;
  }

  async updateCompany(id: number, companyData: Partial<Company>): Promise<Company | undefined> {
    const company = this.companies.get(id);
    if (!company) return undefined;
    
    const updatedCompany = { ...company, ...companyData };
    this.companies.set(id, updatedCompany);
    return updatedCompany;
  }

  // NOTIFICATION METHODS
  async getNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const createdAt = new Date();
    const notification: Notification = { ...insertNotification, id, createdAt };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updatedNotification = { ...notification, read: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  // ACTIVITY METHODS
  async getActivities(limit: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const createdAt = new Date();
    const activity: Activity = { ...insertActivity, id, createdAt };
    this.activities.set(id, activity);
    return activity;
  }

  async getUserActivities(userId: number, limit: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // BURNOUT METHODS
  async getBurnoutSymptoms(userId: number): Promise<BurnoutSymptoms | undefined> {
    return this.burnoutSymptoms.get(userId);
  }

  // SEED DATA
  private seedCompanies() {
    // Meta
    this.createCompany({
      name: "META",
      code: "meta",
      totalDepartures: 1247,
      avgTenure: 28, // 2.3 years in months
      weeklyTrends: [30, 45, 38, 55, 60, 75, 85, 95],
      exitReasons: {
        "Toxic Culture": 43,
        "Burnout": 27,
        "Better Comp": 21,
        "No Growth": 9
      },
      destinations: {
        "Startups": 38,
        "Other Big Tech": 31,
        "Freelance": 17,
        "Career Change": 14
      }
    });

    // Apple
    this.createCompany({
      name: "APPLE",
      code: "apple",
      totalDepartures: 843,
      avgTenure: 36, // 3 years in months
      weeklyTrends: [20, 25, 30, 40, 38, 42, 48, 55],
      exitReasons: {
        "Work-Life Balance": 38,
        "Management Issues": 29,
        "Better Comp": 24,
        "Relocation": 9
      },
      destinations: {
        "Startups": 32,
        "Other Big Tech": 40,
        "Freelance": 13,
        "Career Change": 15
      }
    });

    // Amazon
    this.createCompany({
      name: "AMAZON",
      code: "amazon",
      totalDepartures: 1892,
      avgTenure: 18, // 1.5 years in months
      weeklyTrends: [75, 80, 85, 90, 92, 87, 95, 98],
      exitReasons: {
        "PIP Culture": 47,
        "Burnout": 32,
        "Better WLB": 15,
        "Relocation": 6
      },
      destinations: {
        "Startups": 29,
        "Other Big Tech": 45,
        "Freelance": 16,
        "Career Change": 10
      }
    });

    // Netflix
    this.createCompany({
      name: "NETFLIX",
      code: "netflix",
      totalDepartures: 564,
      avgTenure: 24, // 2 years in months
      weeklyTrends: [30, 28, 35, 42, 45, 50, 55, 60],
      exitReasons: {
        "Keeper Test": 41,
        "Stress": 26,
        "Better Offer": 22,
        "Relocation": 11
      },
      destinations: {
        "Startups": 42,
        "Other Big Tech": 35,
        "Freelance": 13,
        "Career Change": 10
      }
    });

    // Google
    this.createCompany({
      name: "GOOGLE",
      code: "google",
      totalDepartures: 1053,
      avgTenure: 40, // 3.3 years in months
      weeklyTrends: [35, 40, 42, 48, 52, 58, 60, 65],
      exitReasons: {
        "Slow Growth": 35,
        "Better Opportunity": 30,
        "Burnout": 22,
        "Layoffs": 13
      },
      destinations: {
        "Startups": 45,
        "Other Big Tech": 32,
        "Freelance": 15,
        "Career Change": 8
      }
    });

    // Microsoft
    this.createCompany({
      name: "MICROSOFT",
      code: "microsoft",
      totalDepartures: 987,
      avgTenure: 42, // 3.5 years in months
      weeklyTrends: [25, 28, 32, 36, 40, 43, 45, 50],
      exitReasons: {
        "Reorganization": 32,
        "Better Offer": 28,
        "Burnout": 25,
        "Relocation": 15
      },
      destinations: {
        "Startups": 30,
        "Other Big Tech": 42,
        "Freelance": 18,
        "Career Change": 10
      }
    });
  }
}

export const storage = new MemStorage();
