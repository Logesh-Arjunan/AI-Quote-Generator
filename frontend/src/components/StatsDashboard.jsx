const StatsDashboard = ({ stats }) => {
  const { totalGenerated = 0, totalFavorites = 0, topicStats = [], toneStats = [] } = stats || {};

  const topTopic = topicStats[0]?._id || 'None';
  const topTone = toneStats[0]?._id || 'None';

  // Calculate percentage of top items
  const maxTopicCount = topicStats[0]?.count || 1;
  const maxToneCount = toneStats[0]?.count || 1;

  const cards = [
    { label: 'Total Generated', value: totalGenerated, desc: 'All time AI quotes', color: 'from-brand-500 to-indigo-500' },
    { label: 'Saved Favorites', value: totalFavorites, desc: 'Selected best works', color: 'from-rose-500 to-orange-500' },
    { label: 'Top Topic', value: topTopic, desc: `${topicStats[0]?.count || 0} quotes generated`, color: 'from-emerald-500 to-teal-500' },
    { label: 'Dominant Tone', value: topTone, desc: `${toneStats[0]?.count || 0} quotes generated`, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${card.color}`}></div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{card.label}</p>
            <p className="text-xl sm:text-2xl font-black mt-2 text-slate-800 dark:text-white truncate">
              {card.value}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Breakdowns Grid */}
      {totalGenerated > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Topics Breakdown */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Top Topics</h3>
            <div className="space-y-3.5">
              {topicStats.slice(0, 4).map((t, i) => {
                const percentage = Math.round((t.count / totalGenerated) * 100);
                const widthPercent = Math.round((t.count / maxTopicCount) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                      <span>{t._id}</span>
                      <span>{t.count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tones Breakdown */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Tone Spectrum</h3>
            <div className="space-y-3.5">
              {toneStats.slice(0, 4).map((t, i) => {
                const percentage = Math.round((t.count / totalGenerated) * 100);
                const widthPercent = Math.round((t.count / maxToneCount) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                      <span>{t._id}</span>
                      <span>{t.count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsDashboard;
