import { PageHeader } from "../shared/page-header";
import { SectionHeading } from "../shared/section-heading";
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
        copy="活動の質とタイミングを追い、導入までの歩留まりを整えます。"
      />

      <section className="panel stack">
        <div className="section-header">
          <SectionHeading
            eyebrow="Timeline"
            info="訪問、見積、試食会、レビューを時系列で確認できます。担当者と活動種別を合わせて次の接点準備に使う想定です。"
            title="最新の営業活動を時系列で確認する"
          />
        </div>
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