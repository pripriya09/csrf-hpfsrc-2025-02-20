import React, { useEffect } from 'react';
import './CustomGoogleTranslate.css'; // Import the CSS file

const CustomGoogleTranslate = () => {
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        autoDisplay: false,
        includedLanguages: "en,es,uk"
      },
      "google_translate_element"
    );

    // Remove "Powered by Google Translate" attribution
    const intervalId = setInterval(() => {
      const googleAttribution = document.querySelector(".goog-te-banner-frame.skiptranslate");
      if (googleAttribution) {
        googleAttribution.style.display = "none";
        clearInterval(intervalId);
      }
    }, 100);
  };

  useEffect(() => {
    const scriptId = 'google-translate-script';

    if (!document.getElementById(scriptId)) {
      const addScript = document.createElement("script");
      addScript.setAttribute("id", scriptId);
      addScript.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      document.body.appendChild(addScript);
    }

    const checkGoogleTranslate = setInterval(() => {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        clearInterval(checkGoogleTranslate);
        googleTranslateElementInit();
      }
    }, 10);

    
// Restore original content after translation
const originalContent = document.querySelectorAll('[data-translate="no"]');
originalContent.forEach(element => {
  const originalText = element.innerHTML; // Store original text
  element.setAttribute('data-original-text', originalText); // Store original text in a data attribute
});

const observer = new MutationObserver(() => {
  originalContent.forEach(element => {
    const originalText = element.getAttribute('data-original-text');
    if (element.innerHTML !== originalText) {
      element.innerHTML = originalText; // Restore original text
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

return () => {
  clearInterval(checkGoogleTranslate);
  observer.disconnect(); // Clean up observer
};

  }, []);

  return (
    <div id="google_translate_element"></div>
  );
};

export default CustomGoogleTranslate;