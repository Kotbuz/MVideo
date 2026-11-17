import type { PCState } from "../../types/types";
import { PowerMeter } from "../PowerMeter/PowerMeter";



interface BuildSummaryProps {
    selectedParts: PCState; // Заменили { cpu: CPU; ... } на BuildState (где есть | null)
    totalWatts: number;
    totalPrice: number;
    warnings: string[];
    onRemove?: (category: keyof PCState) => void;
}


export function BuildSummary({
    selectedParts,
    totalWatts,
    totalPrice,
    warnings,
}: BuildSummaryProps) {
    const rows = [
        { label: 'Процессор', item: selectedParts.cpu },
        { label: 'Видеокарта', item: selectedParts.gpu },
        { label: 'Память (RAM)', item: selectedParts.ram },
        { label: 'Блок питания', item: selectedParts.psu },
    ];

    return (
        <aside className="build-summary">
            <h2>Ваша сборка</h2>

            {/* Список выбранных комплектующих */}
            <div className="summary-parts">
                {rows.map(({ label, item }) => (
                    <div key={label} className="summary-row">
                        <div className="summary-part-info">
                            <span className="summary-label">{label}</span>
                            <span className={`summary-name${item ? "" : " empty"}`}>
                                {item ? item.name : 'Не выбрано'}
                            </span>
                        </div>
                        {item && (
                            <div className="summary-price-info">
                                <span className="summary-price">
                                    {item.price.toLocaleString('ru-RU')} ₽
                                </span>
                                <span className="summary-watts">
                                    {'maxWatts' in item ? `${item.maxWatts} Вт` : `${item.watts} Вт`}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Индикатор нагрузки */}
            <PowerMeter
                currentWatts={totalWatts}
                maxWatts={selectedParts.psu?.maxWatts ?? 0}
            />


            {/* Предупреждения */}
            {warnings.length > 0 && (
                <div className="warnings">
                    {warnings.map((warning, idx) => (
                        <div
                            key={idx}
                            className="warning"
                        >
                            {warning}
                        </div>
                    ))}
                </div>
            )}

            {/* Итоговая стоимость */}
            <div className="summary-total">
                <span className="summary-total-label">Итоговая цена:</span>
                <span className="summary-total-price">
                    {totalPrice.toLocaleString('ru-RU')} ₽
                </span>
            </div>
        </aside>
    );
}