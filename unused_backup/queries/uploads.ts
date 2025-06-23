// import "server-only";
import { desc } from "drizzle-orm";

import { db } from "~/db";
import { userTable, type User, type MediaUpload } from "~/db/schema";

// Local type definition for user with uploads
type UserWithUploads = User & {
  uploads: MediaUpload[];
};

// Fetch users and their uploads using relational queries
export async function getUsersWithUploads(): Promise<UserWithUploads[]> {
  try {
    const users: UserWithUploads[] = await db.query.userTable.findMany({
      orderBy: [desc(userTable.createdAt)],
      with: {
        uploads: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Failed to fetch users with uploads:", error);
    return [];
  }
}
