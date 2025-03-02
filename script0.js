document.addEventListener("DOMContentLoaded", function () {
    const manualText = document.getElementById("manualText");
    const targetLanguage = document.getElementById("targetLanguage");
    const translateButton = document.getElementById("translateButton");
    const translatedText = document.getElementById("translatedText");
    const imageInput = document.getElementById("imageInput");
    const imagePreview = document.getElementById("imagePreview");
    const detectTextButton = document.getElementById("detectTextButton");
    const detectedText = document.getElementById("detectedText");
    const translateManualTextButton = document.getElementById("translateManualTextButton");
    const imageTranslatedText = document.createElement("pre");
    imageTranslatedText.id = "imageTranslatedText";
    imageTranslatedText.textContent = "Image translation will appear here...";
    document.querySelector(".container").appendChild(imageTranslatedText);

    // Function to translate text
    async function translateText(text, language) {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${language}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.responseData.translatedText;
        } catch (error) {
            console.error("Translation error:", error);
            return "Translation failed.";
        }
    }

    // Event listener for translating manual text
    translateButton.addEventListener("click", async function () {
        const text = manualText.value.trim();
        if (text) {
            const translated = await translateText(text, targetLanguage.value);
            translatedText.textContent = translated;
        } else {
            translatedText.textContent = "Please enter text to translate.";
        }
    });

    // Image upload preview
    imageInput.addEventListener("change", function () {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });

    // Text detection from image using Tesseract.js
    detectTextButton.addEventListener("click", function () {
        if (imageInput.files.length === 0) {
            detectedText.textContent = "Please upload an image first.";
            return;
        }

        detectedText.textContent = "Processing image...";
        Tesseract.recognize(
            imageInput.files[0],
            "eng", // English language model
            {
                logger: (m) => console.log(m),
            }
        ).then(({ data: { text } }) => {
            detectedText.textContent = text.trim() || "No text detected.";
        }).catch((error) => {
            console.error("OCR error:", error);
            detectedText.textContent = "Error in text detection.";
        });
    });

    // Translate detected text and show separately
    translateManualTextButton.addEventListener("click", async function () {
        const text = detectedText.textContent.trim();
        if (text && text !== "Text will appear here..." && text !== "Processing image...") {
            const translated = await translateText(text, targetLanguage.value);
            imageTranslatedText.textContent = translated;
        } else {
            imageTranslatedText.textContent = "No text detected to translate.";
        }
    });
});