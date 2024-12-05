import {prisma} from './db'

export async function unlockAchievement(userId: string, achievementName: string) {
  const achievement = await prisma.achievement.findUnique({
    where: { name: achievementName },
  })

  if (!achievement) {
    throw new Error(`Achievement ${achievementName} not found`)
  }

  return await prisma.userAchievement.create({
    data: {
      userId,
      achievementId: achievement.id,
    },
  })
}

export async function checkAndUnlockAchievements(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      entries: true,
      achievements: {
        include: { achievement: true },
      },
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const achievements = []

  // Check for first entry achievement
  if (user.entries.length === 1) {
    achievements.push(await unlockAchievement(userId, 'First Entry'))
  }

  // Check for 10 entries achievement
  if (user.entries.length === 10) {
    achievements.push(await unlockAchievement(userId, '10 Entries'))
  }

  // Check for 7-day streak achievement
  if (user.currentStreak === 7) {
    achievements.push(await unlockAchievement(userId, '7-Day Streak'))
  }

  // Check for level 5 achievement
  if (user.level === 5) {
    achievements.push(await unlockAchievement(userId, 'Level 5'))
  }

  return achievements
}

