
import React, { useState, useEffect } from 'react';

const ScenariosToRun = ({ scenariosToRun }) => {

  return (<p className="Runtime__start-stop-description">
    {scenariosToRun && scenariosToRun.length > 0 && scenariosToRun.map ? (
      <span className="Runtime__start-stop-scenarios">
        {scenariosToRun.map(s => s.name)
          .join(", ")}
      </span>
    ) : (
      <span>Ei ajettavaksi valittuja skenaarioita</span>
    )}
  </p>)
}