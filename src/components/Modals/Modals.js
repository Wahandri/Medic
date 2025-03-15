import React from "react";

const Modals = ({
  showApplianceModal,
  setShowApplianceModal,
  appliancesList,
  selectedAppliances,
  setSelectedAppliances,
  showWarning,
  setShowWarning,
  warningMessage,
  recipe,
  fetchRecipe,
}) => {
  return (
    <>
      {/* Modal de electrodomésticos */}
      {showApplianceModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Selecciona los electrodomésticos disponibles:</h2>
            {appliancesList.map((appliance) => (
              <label key={appliance}>
                <input
                  type="checkbox"
                  checked={selectedAppliances.includes(appliance)}
                  onChange={() =>
                    setSelectedAppliances((prev) =>
                      prev.includes(appliance)
                        ? prev.filter((a) => a !== appliance)
                        : [...prev, appliance]
                    )
                  }
                />
                {appliance}
              </label>
            ))}
            <button onClick={() => setShowApplianceModal(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal de Advertencia */}
      {showWarning && (
        <div className="modal-overlay">
          <div className="warning-modal">
            <h2>¡¡Precaución!!</h2>
            <div className="warning-content">
              <p>⚠️ {warningMessage}</p>
              <button
                onClick={() => setShowWarning(false)}
                className="warning-close-button"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receta generada */}
      {recipe && (
        <div className="recipe-result">
          <h2>{recipe.title}</h2>
          <h3>Ingredientes:</h3>
          <ul>
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient}</li>
            ))}
          </ul>
          <h3>Pasos:</h3>
          <div className="pasos">
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </div>
          {recipe.tips && <p className="recipe-tips">💡 {recipe.tips}</p>}
          <button onClick={fetchRecipe} className="new-recipe-button">
            🔄 Generar Otra Receta
          </button>
        </div>
      )}
    </>
  );
};

export default Modals;
