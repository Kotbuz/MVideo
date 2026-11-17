import { useEffect, useReducer, useState } from "react";
import "./App.css";
import { BuildSummary } from "./components/BuildSummary/BuildSummary";
import { PartCard } from "./components/PartCard/PartCard";
import {
  type PCState,
  pcReducer,
  initialState,
} from "./types/types";
import { PARTS_DATA } from "./data/parts";

const STORAGE_KEY = "pc-configurator-build";

function loadInitialState(defaultState: PCState): PCState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
  } catch {
    return defaultState;
  }
}

function App() {
  const [state, dispatch] = useReducer(pcReducer, initialState, loadInitialState);

  // Локальные состояния (Пункт 2.Б)
  const [activeTab, setActiveTab] = useState<keyof PCState>("cpu");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Автосохранение и уведомление на 2 секунды (Пункт 2.В)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    setShowSavedToast(true);
    const timerId = setTimeout(() => {
      setShowSavedToast(false);
    }, 2000);

    return () => clearTimeout(timerId);
  }, [state]);

  // Фильтрация деталей для активной вкладки
  const filteredParts = PARTS_DATA.filter(
    (part) => part.category === activeTab && (!onlyInStock || part.inStock)
  );

  // Подсчет энергопотребления и стоимости
  const totalWatts =
    (state.cpu?.watts || 0) +
    (state.gpu?.watts || 0) +
    (state.ram?.watts || 0);

  const totalPrice =
    (state.cpu?.price || 0) +
    (state.gpu?.price || 0) +
    (state.ram?.price || 0) +
    (state.psu?.price || 0);

  // Проверка предупреждений
  const warnings: string[] = [];
  if (!state.cpu) {
    warnings.push("Не выбран процессор");
  }
  if (!state.psu) {
    warnings.push("Не выбран блок питания");
  } else if (state.psu.maxWatts !== undefined && totalWatts > state.psu.maxWatts) {
    warnings.push("Внимание: мощность БП меньше потребления системы!");
  }

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <div className="app-heading">
            <h1>Конфигуратор ПК</h1>
            <p>
              Выберите комплектующие для расчета мощности и стоимости
            </p>
          </div>

          <div className="header-actions">
            {showSavedToast && (
              <span className="saved-toast">
                Конфигурация сохранена...
              </span>
            )}
            <button
              type="button"
              onClick={() => dispatch({ type: "RESET_BUILD" })}
              className="reset-button"
            >
              Сбросить сборку
            </button>
          </div>
        </header>

        <div className="build-layout">
          <div className="parts-column">
            {/* Панель вкладок и фильтр */}
            <div className="parts-toolbar">
              <div className="part-tabs">
                {(["cpu", "gpu", "ram", "psu"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`part-tab${activeTab === tab ? " active" : ""}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <label className="stock-filter">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                />
                Только в наличии
              </label>
            </div>

            {/* Сетка карточек выбранной категории */}
            <section>
              <div className="parts-grid">
                {filteredParts.map((part) => (
                  <PartCard
                    key={part.id}
                    part={part}
                    isSelected={state[part.category]?.id === part.id}
                    onSelect={(selected) =>
                      dispatch({ type: "SELECT_PART", payload: selected })
                    }
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Боковая панель со сводкой */}
          <div>
            <BuildSummary
              selectedParts={state}
              totalWatts={totalWatts}
              totalPrice={totalPrice}
              warnings={warnings}
              onRemove={(category) =>
                dispatch({ type: "REMOVE_PART", payload: category })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;