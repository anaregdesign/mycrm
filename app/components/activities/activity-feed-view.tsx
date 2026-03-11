import { PageHeader } from "../shared/page-header";
import { StatusPill } from "../shared/status-pill";

export function ActivityFeedView({
  activities,
}: {
  activities: Array<{
    id: string;
    accountName: string;
    type: string;
    subject: string;
    scheduledFor: string;
    owner: string;
    status: string;
    notes: string;
  }>;
}) {
  return (
    <main className="page">
      <PageHeader
        eyebrow="Activities"
        title="訪問、見積、試食会、レビューを営業計画として残す"
        copy="案件だけでなく、その前後にある活動の質とタイミングを追い、サンプルから導入までの歩留まりを改善します。"
      />

      <section className="panel stack">
        <div className="timeline">
          {activities.map((activity) => (
            <div className="timeline-item" key={activity.id}>
              <div className="timeline-date">{activity.scheduledFor}</div>
              <div className="list-card">
                <div className="list-card__top">
                  <div>
                    <strong>{activity.subject}</strong>
                    <p className="list-meta">{activity.accountName} / {activity.owner} / {activity.type}</p>
                  </div>
                  <StatusPill label={activity.status} />
                </div>
                <p className="subtle-text">{activity.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}