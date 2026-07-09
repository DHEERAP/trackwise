import { Types } from 'mongoose';
import { Application } from '../../../models';
import { APPLICATION_STATUS } from '../../../constants/application.constants';

export const dashboardService = {
  getStats: async (userId: string) => {
    const userObjectId = new Types.ObjectId(userId);

    const [statusCounts, upcomingInterviews, followUpsDue, recentApplications] =
      await Promise.all([
        Application.aggregate([
          { $match: { userId: userObjectId, isArchived: false } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        Application.find({
          userId: userObjectId,
          isArchived: false,
          interviewDate: { $gte: new Date() },
        })
          .sort({ interviewDate: 1 })
          .limit(5)
          .lean(),
        Application.find({
          userId: userObjectId,
          isArchived: false,
          followUpDate: { $lte: new Date() },
          status: { $nin: ['Offer', 'Rejected', 'Withdrawn'] },
        })
          .sort({ followUpDate: 1 })
          .limit(5)
          .lean(),
        Application.find({ userId: userObjectId, isArchived: false })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ]);

    // Build status map
    const statusMap: Record<string, number> = {};
    APPLICATION_STATUS.forEach((s) => (statusMap[s] = 0));
    statusCounts.forEach((item: { _id: string; count: number }) => {
      statusMap[item._id] = item.count;
    });

    const total = Object.values(statusMap).reduce((a, b) => a + b, 0);
    const active = total - (statusMap['Offer'] + statusMap['Rejected'] + statusMap['Withdrawn']);

    return {
      stats: {
        total,
        active,
        upcomingInterviewsCount: upcomingInterviews.length,
        offers: statusMap['Offer'],
        rejected: statusMap['Rejected'],
        followUpsDueCount: followUpsDue.length,
        byStatus: statusMap,
      },
      upcomingInterviews,
      followUpsDue,
      recentApplications,
    };
  },
};
