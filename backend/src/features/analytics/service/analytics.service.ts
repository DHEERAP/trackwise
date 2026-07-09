import { Types } from 'mongoose';
import { Application } from '../../../models';

export const analyticsService = {
  getAnalytics: async (userId: string) => {
    const userObjectId = new Types.ObjectId(userId);

    const [applicationsPerMonth, statusDistribution, platformDistribution] =
      await Promise.all([
        // Applications per month (last 12 months)
        Application.aggregate([
          {
            $match: {
              userId: userObjectId,
              isArchived: false,
              createdAt: {
                $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
              },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]),

        // Status distribution
        Application.aggregate([
          { $match: { userId: userObjectId, isArchived: false } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),

        // Platform distribution
        Application.aggregate([
          {
            $match: {
              userId: userObjectId,
              isArchived: false,
              platform: { $exists: true, $ne: null },
            },
          },
          { $group: { _id: '$platform', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
      ]);

    // Compute rates
    const total = statusDistribution.reduce(
      (sum: number, s: { count: number }) => sum + s.count,
      0
    );
    const offers = statusDistribution.find(
      (s: { _id: string }) => s._id === 'Offer'
    )?.count ?? 0;
    const interviews = statusDistribution
      .filter((s: { _id: string }) =>
        ['Technical Interview', 'HR Interview', 'Offer'].includes(s._id)
      )
      .reduce((sum: number, s: { count: number }) => sum + s.count, 0);

    return {
      applicationsPerMonth: applicationsPerMonth.map(
        (item: { _id: { year: number; month: number }; count: number }) => ({
          year: item._id.year,
          month: item._id.month,
          count: item.count,
        })
      ),
      statusDistribution: statusDistribution.map(
        (item: { _id: string; count: number }) => ({
          status: item._id,
          count: item.count,
        })
      ),
      platformDistribution: platformDistribution.map(
        (item: { _id: string; count: number }) => ({
          platform: item._id,
          count: item.count,
        })
      ),
      rates: {
        total,
        offerRate: total > 0 ? Math.round((offers / total) * 100) : 0,
        interviewRate: total > 0 ? Math.round((interviews / total) * 100) : 0,
      },
    };
  },
};
