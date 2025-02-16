document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('water-form');
    const resultsSection = document.getElementById('results');
    const analysisOutput = document.getElementById('analysis-output');
    const loadingBarContainer = document.getElementById('loading-bar-container');
    const loadingBar = document.getElementById('loading-bar');
    const safetyAssessment = document.getElementById('safety-assessment');
    const suggestionsDiv = document.getElementById('suggestions');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const ph = parseFloat(document.getElementById('ph').value);
        const turbidity = parseFloat(document.getElementById('turbidity').value);
        const heavyMetals = parseFloat(document.getElementById('heavy-metals').value);
        const microplastic = parseFloat(document.getElementById('microplastic').value);

        loadingBarContainer.style.display = 'block';
        loadingBar.style.width = '0%';

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            loadingBar.style.width = progress + '%';

            if (progress >= 100) {
                clearInterval(interval);

                setTimeout(() => {
                    const isSafe = calculateWaterSafety(ph, turbidity, heavyMetals, microplastic);
                    const suggestions = getSuggestions(ph, turbidity, heavyMetals, microplastic);

                    displayResults(isSafe, suggestions);
                    loadingBarContainer.style.display = 'none';
                    resultsSection.style.display = 'block';

                }, 500);
            }
        }, 50);
    });

    function calculateWaterSafety(ph, turbidity, heavyMetals, microplastic) {
        const intercept = 1;
        const phCoefficient = 0.1;
        const turbidityCoefficient = -0.2;
        const heavyMetalsCoefficient = -1.5;
        const microplasticCoefficient = -0.8;

        const MLR = intercept +
            phCoefficient * ph +
            turbidityCoefficient * turbidity +
            heavyMetalsCoefficient * heavyMetals +
            microplasticCoefficient * microplastic;

        const probability = 1 / (1 + Math.exp(-MLR));

        return probability > 0.5;
    }

    function getSuggestions(ph, turbidity, heavyMetals, microplastic) {
        let suggestions = "<h3 style='color: #333;'>Here are some tips based on your input:</h3><ul>";

        if (ph < 6.5) {
            suggestions += "<li>Add a pH-raising substance like soda ash.</li>";
        } else if (ph > 8.5) {
            suggestions += "<li>Add a pH-lowering substance like lemon juice or vinegar (for small-scale treatment).</li>";
        }

        if (turbidity > 5) {
            suggestions += "<li>Use a water filter to reduce turbidity.</li>";
        }

        if (heavyMetals > 0.1) {
            suggestions += "<li>Investigate the source of contamination.</li>";
        }

        if (microplastic > 0.1) {
            suggestions += "<li>Install a microplastic filter.</li>";
        }

        suggestions += "</ul>";
        return suggestions;
    }

    function displayResults(isSafe, suggestions) {
        if (isSafe) {
            safetyAssessment.textContent = "Based on the provided parameters, the water is assessed as SAFE to drink (probability above 70%).";
            safetyAssessment.style.color = 'green';

        } else {
            safetyAssessment.textContent = "Based on the provided parameters, the water is assessed as UNSAFE to drink (probability below 70%).";
            safetyAssessment.style.color = 'red';
        }

        suggestionsDiv.innerHTML = suggestions;
    }
});