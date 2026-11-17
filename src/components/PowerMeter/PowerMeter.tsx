interface PowerMeterProps {
    currentWatts: number;
    maxWatts: number;
}

export function PowerMeter({ currentWatts, maxWatts }: PowerMeterProps) {
    const percentage = maxWatts > 0 ? Math.round((currentWatts / maxWatts) * 100) : 0;
    const clampedWidth = Math.min(percentage, 100);
    const isOverloaded = maxWatts > 0 && currentWatts > maxWatts;
    const isHighLoad = !isOverloaded && percentage >= 80;
    const loadClass = isOverloaded ? "overloaded" : isHighLoad ? "high" : "normal";

    return (
        <div className="power-meter">
            <div className="power-meter-heading">
                <div>
                    <span className="power-meter-label">Нагрузка на БП</span>
                    <span className="power-meter-value">
                        {currentWatts} Вт <span className="power-meter-max">/ {maxWatts} Вт</span>
                    </span>
                </div>
                <span
                    className={`power-meter-percentage ${loadClass}`}
                >
                    {maxWatts > 0 ? `${percentage}%` : '—'}
                </span>
            </div>

            <div className="power-meter-track">
                <div
                    className={`power-meter-fill ${loadClass}`}
                    style={{ width: `${maxWatts > 0 ? clampedWidth : 0}%` }}
                />
            </div>
        </div>
    );
}