export function showError(msg, type = 'error', duration = 3000) {
  let errElem = document.getElementById('searchError');
  if (!errElem) {
    errElem = document.createElement('div');
    errElem.id = 'searchError';
    errElem.classList.add('searchError');
    document.body.insertBefore(errElem, document.body.firstChild);
  }
  errElem.textContent = msg;
  errElem.classList.remove('error', 'warning', 'info');
  errElem.classList.add(type);
  errElem.style.display = 'block';

  console[type === 'error' ? 'error' : type === 'warning' ? 'warn' : 'log']('❗ showError:', msg);

  clearTimeout(errElem._timeout);
  errElem._timeout = setTimeout(() => {
    errElem.style.display = 'none';
  }, duration);
}

export function hideError() {
  const errElem = document.getElementById('searchError');
  if (errElem) errElem.style.display = 'none';
}

// Globale JS errors
window.onerror = function (message, source, lineno, colno, error) {
  showError(
    `Onverwachte fout: ${message} (${source}:${lineno}:${colno})`,
    'error',
    10000
  );
  return false;
};

// Ongehandelde promise rejections
window.onunhandledrejection = function (event) {
  showError(
    `Onverwachte fout: ${event.reason ? event.reason : event}`,
    'error',
    10000
  );
};

// Fetch wrapper
export async function safeFetch(url, options) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      let msg = `Serverfout: ${res.status}`;
      if (res.status === 404) msg = 'Niet gevonden (404)';
      if (res.status === 500) msg = 'Interne serverfout (500)';
      showError(msg, 'error', 6000);
      throw new Error(msg);
    }
    return res;
  } catch (e) {
    showError('Netwerkfout: Kan geen verbinding maken met de server.', 'error', 1000);
    throw e;
  }
}

// Afbeeldingsfouten
window.addEventListener('error', function (event) {
  if (event.target && event.target.tagName === 'IMG') {
    showError('Afbeelding kon niet geladen worden.', 'warning', 1000);
  }
}, true);

// Formulier validatie
document.addEventListener('invalid', function (event) {
  event.preventDefault();
  showError('Ongeldige invoer: ' + event.target.validationMessage, 'warning');
}, true);
