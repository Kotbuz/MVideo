import type { Part } from "../../types/types";


interface PartCardProps {
    part: Part;
    isSelected: boolean;
    onSelect: (part: Part) => void;
}

export function PartCard({ part, isSelected, onSelect }: PartCardProps) {
    return (
        <div
            onClick={() => onSelect(part)}
            className={`part-card${isSelected ? " selected" : ""}`}
        >
            <div>
                <div className="part-card-heading">
                    <h3 className="part-card-name">{part.name}</h3>
                    <span
                        className={`part-wattage ${part.category === "psu" ? "psu" : "component"}`}
                    >
                        {part.category === "psu" ? `+${part.maxWatts} Вт` : `${part.watts} Вт`}
                    </span>
                </div>

                {"socket" in part && (
                    <p className="part-socket">Сокет: {part.socket}</p>
                )}
            </div>

            <div className="part-card-footer">
                <span className="part-price">
                    {part.price.toLocaleString("ru-RU")} ₽
                </span>

                <button
                    type="button"
                    className={`part-card-button${isSelected ? " selected" : ""}`}
                >
                    {isSelected ? "Выбрано" : "Выбрать"}
                </button>
            </div>
        </div>
    );
}