/**
 * Premium Interactive Rates & Calculator Script - Assainitech
 * Handles Search, Category Tabs, Estimator Widget, and smooth-scroll prefill
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Category Filtering and Searching
    // -------------------------------------------------------------
    const searchInput = document.querySelector('.tarifs-search-input');
    const tabButtons = document.querySelectorAll('.tarifs-tab-btn');
    const cards = document.querySelectorAll('.tarif-card');

    let currentCategory = 'all';
    let searchQuery = '';

    function filterCards() {
        cards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const title = card.querySelector('.tarif-card-title').textContent.toLowerCase();
            const desc = card.querySelector('.tarif-card-desc').textContent.toLowerCase();
            
            const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory);
            const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.classList.remove('hidden');
                // Trigger quick visual fade-in animation
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.classList.add('hidden');
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterCards();
        });
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-tab');
            filterCards();
        });
    });

    // -------------------------------------------------------------
    // 2. Interactive Calculator / Estimator
    // -------------------------------------------------------------
    const serviceSelect = document.getElementById('estimator-service-select');
    const septicSliderRow = document.getElementById('estimator-septic-slider-row');
    const curageSliderRow = document.getElementById('estimator-curage-slider-row');
    const greaseSliderRow = document.getElementById('estimator-grease-slider-row');
    
    // Sliders & Value Displays
    const septicSlider = document.getElementById('septic-volume-slider');
    const septicVal = document.getElementById('septic-volume-val');
    
    const curageSlider = document.getElementById('curage-length-slider');
    const curageVal = document.getElementById('curage-length-val');
    
    const greaseSlider = document.getElementById('grease-volume-slider');
    const greaseVal = document.getElementById('grease-volume-val');

    // Result Display elements
    const resultLabel = document.querySelector('.estimator-result-label');
    const resultPrice = document.querySelector('.estimator-result-price');
    const resultInfo = document.querySelector('.estimator-result-info');
    const estimatorDevisBtn = document.getElementById('estimator-devis-btn');

    function updateCalculator() {
        if (!serviceSelect) return;

        const selectedService = serviceSelect.value;

        // Hide all sliders initially
        if (septicSliderRow) septicSliderRow.style.display = 'none';
        if (curageSliderRow) curageSliderRow.style.display = 'none';
        if (greaseSliderRow) greaseSliderRow.style.display = 'none';
        
        // Show btn by default, edit text / link behavior
        if (estimatorDevisBtn) {
            estimatorDevisBtn.style.display = 'inline-block';
            estimatorDevisBtn.textContent = "Obtenir ce Devis en 2 min";
        }

        let calculatedText = "";
        let calculatedPrice = "";
        let infoText = "";
        let subjectText = "";

        switch (selectedService) {
            case 'vidange-fosse':
                if (septicSliderRow) septicSliderRow.style.display = 'flex';
                const vFosse = parseFloat(septicSlider.value);
                if (septicVal) septicVal.textContent = vFosse;
                
                subjectText = `Vidange Fosse Septique - ${vFosse} m³`;
                
                // Formula: 350€ HT up to 3m³, then 130€ HT per m³ extra
                let baseFosse = 350;
                let totalFosse = baseFosse;
                if (vFosse > 3) {
                    totalFosse += (vFosse - 3) * 130;
                }
                
                calculatedPrice = `${totalFosse}€ HT`;
                infoText = `Tarif estimé comprenant le pompage, le transport et le traitement en centre agréé. (Inclus jusqu'à 3m³ pour ${baseFosse}€ HT, puis 130€ HT/m³ supplémentaire).`;
                calculatedText = "Estimation Vidange Fosse";
                break;

            case 'curage':
                if (curageSliderRow) curageSliderRow.style.display = 'flex';
                const lCurage = parseInt(curageSlider.value);
                if (curageVal) curageVal.textContent = lCurage;
                
                subjectText = `Curage Canalisations - ${lCurage} ML`;
                
                // Formula: 35€ HT per linear meter (ML)
                let totalCurage = lCurage * 35;
                calculatedPrice = `${totalCurage}€ HT`;
                infoText = `Tarif hydrocurage haute pression estimé pour une longueur totale de ${lCurage} mètres linéaires à 35€ HT le mètre.`;
                calculatedText = "Estimation Curage Haute Pression";
                break;

            case 'vidange-bag':
                if (greaseSliderRow) greaseSliderRow.style.display = 'flex';
                const vGrease = parseFloat(greaseSlider.value);
                if (greaseVal) greaseVal.textContent = vGrease.toFixed(1);
                
                subjectText = `Vidange Bac à Graisse - ${vGrease} m³`;
                
                // Formula: 350€ HT per m³
                let totalGrease = Math.ceil(vGrease * 350);
                calculatedPrice = `${totalGrease}€ HT`;
                infoText = `Tarif estimé sur la base de 350€ HT par m³ aspiré et nettoyé, incluant l'élimination des graisses en filière de traitement agréée.`;
                calculatedText = "Estimation Vidange Bac à Graisse";
                break;

            case 'debouchage':
                calculatedPrice = "300€ HT";
                infoText = "Forfait débouchage haute pression pour canalisations privatives (WC, salle de bain, cuisine). Tarif TTC de 330€ (TVA 10%). Intervention rapide 24h/7j.";
                calculatedText = "Forfait Débouchage";
                subjectText = "Débouchage canalisations (Forfait)";
                break;

            case 'debouchage-colonnes':
                calculatedPrice = "À partir de 350€ HT";
                infoText = "Débouchage de colonnes collectives ou d'immeubles. Matériel hydrocureur professionnel. Sur devis ou forfait de base selon la complexité.";
                calculatedText = "Débouchage Colonnes";
                subjectText = "Débouchage colonnes immeubles";
                break;

            case 'inspection':
                calculatedPrice = "À partir de 450€ HT";
                infoText = "Passage de caméra endoscopique haute définition avec rapport écrit et enregistrement vidéo fourni. Idéal pour diagnostic pré-achat ou recherche de casse.";
                calculatedText = "Inspection Caméra";
                subjectText = "Inspection Caméra Vidéo";
                break;

            case 'autre-devis':
                calculatedPrice = "Sur Devis";
                infoText = "Pompes de relevage, dégazage de cuve, terrassement, conformité... Nos techniciens se déplacent gratuitement pour établir un chiffrage précis sous 24h.";
                calculatedText = "Étude Personnalisée";
                subjectText = "Demande de devis - Travaux Spécifiques";
                break;

            default:
                calculatedPrice = "--";
                infoText = "Sélectionnez un service pour afficher son estimation tarifaire.";
                calculatedText = "Tarif Estimé";
                subjectText = "";
        }

        if (resultLabel) resultLabel.textContent = calculatedText;
        if (resultPrice) {
            resultPrice.textContent = calculatedPrice;
            // Add subtle dynamic animation on update
            resultPrice.style.transform = 'scale(1.1)';
            resultPrice.style.transition = 'transform 0.2s ease';
            setTimeout(() => {
                resultPrice.style.transform = 'scale(1)';
            }, 200);
        }
        if (resultInfo) resultInfo.textContent = infoText;

        // Update button click pre-fill event
        if (estimatorDevisBtn && subjectText) {
            estimatorDevisBtn.onclick = (e) => {
                e.preventDefault();
                prefillContactForm(subjectText);
            };
        }
    }

    // Attach listeners to Calculator Select and Sliders
    if (serviceSelect) {
        serviceSelect.addEventListener('change', updateCalculator);
    }
    if (septicSlider) {
        septicSlider.addEventListener('input', updateCalculator);
    }
    if (curageSlider) {
        curageSlider.addEventListener('input', updateCalculator);
    }
    if (greaseSlider) {
        greaseSlider.addEventListener('input', updateCalculator);
    }

    // Initialize calculator
    updateCalculator();

    // -------------------------------------------------------------
    // 3. Contact Form Pre-filling Logic
    // -------------------------------------------------------------
    function prefillContactForm(serviceName) {
        const contactFormSection = document.getElementById('contact-form-section');
        const subjectInput = document.getElementById('contact-subject');
        
        if (subjectInput) {
            subjectInput.value = `Demande de devis : ${serviceName}`;
            // Add highlight glow to the input
            subjectInput.focus();
            subjectInput.classList.add('input-highlight-glow');
            setTimeout(() => {
                subjectInput.classList.remove('input-highlight-glow');
            }, 2000);
        }

        if (contactFormSection) {
            contactFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Attach listeners to all Tariff Card "Demander un devis" buttons
    cards.forEach(card => {
        const devisBtn = card.querySelector('.tarif-card-btn');
        const title = card.querySelector('.tarif-card-title').textContent;
        if (devisBtn && title) {
            devisBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prefillContactForm(title.trim());
            });
        }
    });

    // Check URL parameters for auto-prefilling on page load (e.g. from service subpages)
    const urlParams = new URLSearchParams(window.location.search);
    const prefillService = urlParams.get('service');
    if (prefillService) {
        // Wait a small delay to make sure scroll transitions and layout are stable
        setTimeout(() => {
            prefillContactForm(prefillService);
        }, 400);
    }
});
