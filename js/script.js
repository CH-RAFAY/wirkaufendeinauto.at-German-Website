emailjs.init({ publicKey: "hugJBwuOk2Mp2bSc7" });

    function setProgress(percent) {
        percent = Math.min(100, Math.max(0, percent));
        document.getElementById('progress-percentage').textContent = percent + '%';
        const progressArc = document.getElementById('progress-arc');
        const radius = 70;
        const circumference = Math.PI * radius;
        const dashLength = (percent / 100) * circumference;
        const gapLength = circumference - dashLength;
        progressArc.setAttribute('stroke-dasharray', `${dashLength} ${gapLength}`);
        progressArc.setAttribute('stroke-dashoffset', '0');
        progressArc.style.stroke = percent === 0 ? '#d1d1d1' : '#4CAF50';
    }

    function updateProgress() {
        const requiredFields = [
            'brand', 'model', 'year', 'shape-group', 'fuel-group', 'variant', 'horsepower-group',
            'transmission-group', 'doors-group', 'mileage', 'keys', 'second-set-tires', 'service-booklet',
            'mot-renewal', 'financing', 'owners', 'exterior-color-group', 'seats-material-group', 'ready-to-drive',
            'accident-damage', 'interior-condition', 'exterior-condition', 'gearbox-working',
            'steering-working', 'brakes-working', 'ac-working', 'vin', 'location', 'sell-plan',
            'prefer-to-sell', 'email'
        ];
        const totalFields = requiredFields.length;
        let filledFields = 0;

        requiredFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (!element || element.classList.contains('hidden')) return;

            if (fieldId === 'variant') {
                const value = element.value;
                if (value && value !== '') {
                    if (value === 'Other') {
                        const otherInput = document.getElementById('variant-other');
                        if (otherInput && otherInput.value.trim()) filledFields++;
                    } else {
                        filledFields++;
                    }
                }
            } else if (element.tagName === 'SELECT') {
                const value = element.value;
                if (value && value !== '') {
                    if (value === 'Other') {
                        const otherInput = document.getElementById(`${fieldId}-other`);
                        if (otherInput && otherInput.value.trim()) filledFields++;
                    } else {
                        filledFields++;
                    }
                }
            } else if (element.tagName === 'INPUT') {
                if (element.value.trim()) filledFields++;
            } else if (element.classList.contains('form-group')) {
                const selectedOption = element.querySelector('.option-box.selected');
                if (selectedOption) {
                    if (selectedOption.dataset.value !== 'Other') {
                        filledFields++;
                    } else {
                        const otherInput = element.querySelector('input[type="text"]');
                        if (otherInput && otherInput.value.trim()) filledFields++;
                    }
                }
            }
        });

        const progressPercent = Math.round((filledFields / totalFields) * 100);
        setProgress(progressPercent);
        const submitButton = document.querySelector('.submit-btn');
        submitButton.disabled = progressPercent !== 100;
    }

    function showGuidance(elementId, show) {
        const guidance = document.getElementById(`${elementId}-guidance`);
        if (guidance) guidance.style.display = show ? 'block' : 'none';
    }

    function resetFormFromField(fieldId) {
        const groups = [
            'shape-group', 'fuel-group', 'variant-group', 'horsepower-group', 
            'transmission-group', 'doors-group', 'mileage-group', 'keys-group', 
            'second-set-tires-group', 'service-booklet-group', 'mot-renewal-group', 
            'financing-group', 'owners-group', 'exterior-color-group', 
            'seats-material-group', 'ready-to-drive-group', 'accident-damage-group', 
            'interior-condition-group', 'exterior-condition-group', 
            'gearbox-working-group', 'steering-working-group', 'brakes-working-group', 
            'ac-working-group', 'vin-group', 'location-group', 'additional-options-group',
            'prefer-to-sell-group', 'email-group'
        ];
        
        const startIndex = groups.indexOf(fieldId);
        if (startIndex !== -1) {
            for (let i = startIndex; i < groups.length; i++) {
                const group = document.getElementById(groups[i]);
                if (group) {
                    group.classList.add('hidden');
                    
                    const inputs = group.querySelectorAll('input, select');
                    inputs.forEach(input => {
                        if (input.type === 'text') {
                            input.value = '';
                        } else if (input.tagName === 'SELECT') {
                            input.selectedIndex = 0;
                        }
                    });
                    
                    const optionBoxes = group.querySelectorAll('.option-box');
                    optionBoxes.forEach(box => box.classList.remove('selected'));
                    
                    const otherInputs = group.querySelectorAll('.other-input');
                    otherInputs.forEach(input => input.classList.add('hidden'));
                }
            }
        }
    }

    document.getElementById('brand').addEventListener('change', function () {
        const brand = this.value;
        const modelSelect = document.getElementById('model');
        
        resetFormFromField('shape-group');
        
        if (brand) {
            modelSelect.disabled = false;
            modelSelect.innerHTML = '<option value="">Modell auswählen</option>';
            (carModels[brand] || []).forEach(model => {
                modelSelect.innerHTML += `<option value="${model}">${model}</option>`;
            });
            modelSelect.innerHTML += '<option value="Other">Andere</option>';
            showGuidance('brand', false);
            
            modelSelect.selectedIndex = 0;
            document.getElementById('year').selectedIndex = 0;
            document.getElementById('year').disabled = true;
            document.getElementById('model-other').classList.add('hidden');
            document.getElementById('model-other').value = '';
        } else {
            modelSelect.disabled = true;
            document.getElementById('model-other').classList.add('hidden');
            document.getElementById('year').disabled = true;
            showGuidance('brand', true);
        }
        updateProgress();
    });

    document.getElementById('model').addEventListener('change', function () {
        const model = this.value;
        const yearSelect = document.getElementById('year');
        const brand = document.getElementById('brand').value;
        
        resetFormFromField('shape-group');
        
        if (model) {
            yearSelect.disabled = false;
            yearSelect.innerHTML = '<option value="">Erstzulassung auswählen</option>';
            if (model !== 'Other') {
                const years = carYears[brand]?.[model] || [];
                years.forEach(year => {
                    yearSelect.innerHTML += `<option value="${year}">${year}</option>`;
                });
                yearSelect.innerHTML += '<option value="Other">Andere</option>';
                document.getElementById('model-other').classList.add('hidden');
                document.getElementById('model-other').value = '';
                showGuidance('model', false);
            } else {
                document.getElementById('model-other').classList.remove('hidden');
                showGuidance('model', true);
            }
        } else {
            yearSelect.disabled = true;
            document.getElementById('model-other').classList.add('hidden');
            showGuidance('model', true);
        }
        updateProgress();
    });

    document.getElementById('model-other').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = this.value.trim();
            const yearSelect = document.getElementById('year');
            const modelSelect = document.getElementById('model');
            if (value) {
                yearSelect.disabled = false;
                yearSelect.innerHTML = '<option value="">Erstzulassung auswählen</option>';
                yearSelect.innerHTML += '<option value="Other">Andere</option>';
                modelSelect.innerHTML += `<option value="${value}" selected>${value}</option>`;
                showGuidance('model-other', false);
                showGuidance('model', false);
            } else {
                yearSelect.disabled = true;
                showGuidance('model-other', true);
            }
            updateProgress();
        }
    });

    document.getElementById('year').addEventListener('change', function () {
        const year = this.value;
        const variantSelect = document.getElementById('variant');
        const brand = document.getElementById('brand').value;
        const model = document.getElementById('model').value;
        
        // Reset all fields that depend on year
        resetFormFromField('shape-group');
        
        if (year === 'Other') {
            document.getElementById('year-other').classList.remove('hidden');
            showGuidance('year', true);
        } else if (year) {
            document.getElementById('year-other').classList.add('hidden');
            document.getElementById('year-other').value = '';
            document.getElementById('shape-group').classList.remove('hidden');
            if (brand && model && model !== 'Other') {
                variantSelect.disabled = false;
                variantSelect.innerHTML = '<option value="">Variante auswählen</option>';
                const variants = carVariants[brand]?.[model] || [];
                variants.forEach(variant => {
                    variantSelect.innerHTML += `<option value="${variant}">${variant}</option>`;
                });
                variantSelect.innerHTML += '<option value="Other">Andere</option>';
            }
            showGuidance('year', false);
        } else {
            document.getElementById('year-other').classList.add('hidden');
            variantSelect.disabled = true;
            showGuidance('year', true);
        }
        updateProgress();
    });

    document.getElementById('year-other').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = this.value.trim();
            const yearSelect = document.getElementById('year');
            if (value) {
                document.getElementById('shape-group').classList.remove('hidden');
                yearSelect.innerHTML += `<option value="${value}" selected>${value}</option>`;
                showGuidance('year-other', false);
                showGuidance('year', false);
            } else {
                showGuidance('year-other', true);
            }
            updateProgress();
        }
    });

    document.getElementById('variant').addEventListener('change', function () {
        const variant = this.value;
        
        resetFormFromField('horsepower-group');
        
        if (variant === 'Other') {
            document.getElementById('variant-other').classList.remove('hidden');
            showGuidance('variant', true);
        } else if (variant) {
            document.getElementById('variant-other').classList.add('hidden');
            document.getElementById('variant-other').value = '';
            document.getElementById('horsepower-group').classList.remove('hidden');
            showGuidance('variant', false);
        } else {
            document.getElementById('variant-other').classList.add('hidden');
            showGuidance('variant', true);
        }
        updateProgress();
    });

    document.getElementById('variant-other').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = this.value.trim();
            const variantSelect = document.getElementById('variant');
            if (value) {
                document.getElementById('horsepower-group').classList.remove('hidden');
                variantSelect.innerHTML += `<option value="${value}" selected>${value}</option>`;
                showGuidance('variant-other', false);
                showGuidance('variant', false);
            } else {
                showGuidance('variant-other', true);
            }
            updateProgress();
        }
    });

    document.querySelectorAll('.option-box').forEach(box => {
        box.addEventListener('click', function () {
            const parentGroup = this.parentElement;
            parentGroup.querySelectorAll('.option-box').forEach(option => option.classList.remove('selected'));
            this.classList.add('selected');
            const otherInput = parentGroup.querySelector('input[type="text"]');
            const groupId = parentGroup.id;
            
            //emailjs.send('service_ysap8wp', 'template_py5wm5n', data)

            resetFormFromField(getNextGroupId(groupId));
            
            if (this.dataset.value === 'Other') {
                otherInput.classList.remove('hidden');
                showGuidance(groupId.replace('-group', ''), true);
            } else {
                otherInput.classList.add('hidden');
                otherInput.value = '';
                showGuidance(groupId.replace('-group', ''), false);
                enableNextGroup(groupId);
            }
            updateProgress();
        });
    });

    function getNextGroupId(currentGroupId) {
        const groups = [
            'shape-group', 'fuel-group', 'variant-group', 'horsepower-group', 
            'transmission-group', 'doors-group', 'mileage-group', 'keys-group', 
            'second-set-tires-group', 'service-booklet-group', 'mot-renewal-group', 
            'financing-group', 'owners-group', 'exterior-color-group', 
            'seats-material-group', 'ready-to-drive-group', 'accident-damage-group', 
            'interior-condition-group', 'exterior-condition-group', 
            'gearbox-working-group', 'steering-working-group', 'brakes-working-group', 
            'ac-working-group', 'vin-group', 'location-group', 'additional-options-group'
        ];
        const currentIndex = groups.indexOf(currentGroupId);
        return currentIndex !== -1 && currentIndex < groups.length - 1 ? groups[currentIndex + 1] : null;
    }

    const optionBoxOtherInputs = ['shape-other', 'fuel-other', 'horsepower-other', 
                                'transmission-other', 'doors-other', 'exterior-color-other', 'seats-material-other'];
    optionBoxOtherInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = this.value.trim();
                const parentGroup = this.closest('.form-group');
                if (value) {
                    showGuidance(inputId.replace('-other', ''), false);
                    enableNextGroup(parentGroup.id);
                } else {
                    showGuidance(inputId.replace('-other', ''), true);
                }
                updateProgress();
            }
        });
    });

    function enableNextGroup(currentGroupId) {
        const groups = [
            'shape-group', 'fuel-group', 'variant-group', 'horsepower-group', 
            'transmission-group', 'doors-group', 'mileage-group', 'keys-group', 
            'second-set-tires-group', 'service-booklet-group', 'mot-renewal-group', 
            'financing-group', 'owners-group', 'exterior-color-group', 
            'seats-material-group', 'ready-to-drive-group', 'accident-damage-group', 
            'interior-condition-group', 'exterior-condition-group', 
            'gearbox-working-group', 'steering-working-group', 'brakes-working-group', 
            'ac-working-group', 'vin-group', 'location-group', 'additional-options-group'
        ];
        const currentIndex = groups.indexOf(currentGroupId);
        if (currentIndex !== -1 && currentIndex < groups.length - 1) {
            document.getElementById(groups[currentIndex + 1]).classList.remove('hidden');
        }
    }

    const dropdowns = [
        'keys', 'second-set-tires', 'service-booklet', 'mot-renewal', 'financing', 
        'owners', 'ready-to-drive', 'accident-damage', 'interior-condition', 
        'exterior-condition', 'gearbox-working', 'steering-working', 'brakes-working', 
        'ac-working', 'sell-plan', 'prefer-to-sell'
    ];

    dropdowns.forEach(dropdownId => {
        document.getElementById(dropdownId).addEventListener('change', function () {
            const value = this.value;
            const parentGroup = this.closest('.form-group');
            
            resetFormFromField(getNextGroupId(parentGroup.id));
            
            if (dropdownId === 'sell-plan' && value) {
                document.getElementById('prefer-to-sell-group').classList.remove('hidden');
                showGuidance('sell-plan', false);
            } else if (dropdownId === 'prefer-to-sell' && value) {
                document.getElementById('email-group').classList.remove('hidden');
                showGuidance('prefer-to-sell', false);
            } else if (value) {
                showGuidance(dropdownId, false);
                enableNextGroup(parentGroup.id);
            } else {
                showGuidance(dropdownId, true);
            }
            updateProgress();
        });
    });

    const textInputs = ['mileage', 'vin', 'location', 'email'];
    textInputs.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', function () {
            const value = this.value.trim();
            const parentGroup = this.closest('.form-group');
            let isValid = false;

            if (inputId === 'vin') {
                const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
                isValid = vinRegex.test(value);
                this.setCustomValidity(isValid ? '' : 'Die FIN muss genau 17 alphanumerische Zeichen haben');
            } else if (inputId === 'email') {
                const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
                isValid = emailRegex.test(value);
                this.setCustomValidity(isValid ? '' : 'Bitte geben Sie eine gültige E-Mail-Adresse ein');
            } else {
                isValid = value !== '';
            }

            if (isValid) {
                showGuidance(inputId, false);
                enableNextGroup(parentGroup.id);
            } else {
                showGuidance(inputId, true);
            }
            updateProgress();
        });
    });

    document.getElementById('car-review-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const submitButton = document.querySelector('.submit-btn');

        const validationMessage = checkFormValidity();
        if (validationMessage !== true) {
            alert('Bitte füllen Sie alle erforderlichen Felder korrekt aus:\n' + validationMessage);
            return;
        }

        submitButton.textContent = 'Wird gesendet ...';
        submitButton.disabled = true;

        const data = {
            brand: document.getElementById('brand').value,
            model: document.getElementById('model').value,
            year: document.getElementById('year').value,
            shape: getValueFromGroup('shape-group'),
            fuel: getValueFromGroup('fuel-group'),
            variant: document.getElementById('variant').value,
            horsepower: getValueFromGroup('horsepower-group'),
            transmission: getValueFromGroup('transmission-group'),
            doors: getValueFromGroup('doors-group'),
            mileage: document.getElementById('mileage').value,
            keys: document.getElementById('keys').value,
            second_set_tires: document.getElementById('second-set-tires').value,
            service_booklet: document.getElementById('service-booklet').value,
            mot_renewal: document.getElementById('mot-renewal').value,
            financing: document.getElementById('financing').value,
            owners: document.getElementById('owners').value,
            exterior_color: getValueFromGroup('exterior-color-group'),
            seats_material: getValueFromGroup('seats-material-group'),
            ready_to_drive: document.getElementById('ready-to-drive').value,
            accident_damage: document.getElementById('accident-damage').value,
            interior_condition: document.getElementById('interior-condition').value,
            exterior_condition: document.getElementById('exterior-condition').value,
            gearbox_working: document.getElementById('gearbox-working').value,
            steering_working: document.getElementById('steering-working').value,
            brakes_working: document.getElementById('brakes-working').value,
            ac_working: document.getElementById('ac-working').value,
            vin: document.getElementById('vin').value,
            location: document.getElementById('location').value,
            sell_plan: document.getElementById('sell-plan').value,
            prefer_to_sell: document.getElementById('prefer-to-sell').value,
            email: document.getElementById('email').value
        };


    emailjs.send('service_iqns8jg', 'template_py5wm5n', data)
            .then(() => {
                alert('Ihre Bewertung wurde erfolgreich übermittelt.');
                document.getElementById('car-review-form').reset();
                location.reload();
            })

            .catch((error) => {
                console.error('EmailJS Fehler:', error);
                alert('Fehler beim Senden Ihrer Bewertung. Bitte versuchen Sie es erneut.');
            })
            .finally(() => {
                submitButton.textContent = 'Bewertung absenden!';
                submitButton.disabled = false;
            });
    });

    function checkFormValidity() {
        const requiredInputs = document.querySelectorAll('.form-group:not(.hidden) input[required], .form-group:not(.hidden) select[required]');
        let isValid = true;
        let errors = [];

        requiredInputs.forEach(input => {
            const value = input.value.trim();
            const parentGroup = input.closest('.form-group');
            const label = parentGroup.querySelector('label').textContent;

            if (!value) {
                isValid = false;
                errors.push(`- ${label} ist erforderlich.`);
                showGuidance(input.id, true);
                return;
            }

            if (input.tagName === 'SELECT' && value === 'Other') {
                const otherInput = parentGroup.querySelector('input[type="text"]');
                if (!otherInput || !otherInput.value.trim()) {
                    isValid = false;
                    errors.push(`- ${label} erfordert einen Wert für "Andere".`);
                    showGuidance(input.id, true);
                }
            }

            if (input.id === 'vin') {
                const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
                if (!vinRegex.test(value)) {
                    isValid = false;
                    errors.push(`- ${label} muss eine gültige 17-stellige FIN sein.`);
                    showGuidance('vin', true);
                }
            }

            if (input.id === 'email') {
                const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errors.push(`- ${label} muss eine gültige E-Mail-Adresse sein.`);
                    showGuidance('email', true);
                }
            }
        });

        const optionBoxGroups = document.querySelectorAll('.form-group:not(.hidden) .option-box');
        optionBoxGroups.forEach(group => {
            const parentGroup = group.closest('.form-group');
            const groupId = parentGroup.id;
            if (!parentGroup.querySelector('.option-box.selected')) {
                const label = parentGroup.querySelector('label').textContent;
                isValid = false;
                errors.push(`- ${label} erfordert eine Auswahl.`);
                showGuidance(groupId.replace('-group', ''), true);
            } else if (parentGroup.querySelector('.option-box.selected')?.dataset.value === 'Other') {
                const otherInput = parentGroup.querySelector('input[type="text"]');
                if (!otherInput || !otherInput.value.trim()) {
                    const label = parentGroup.querySelector('label').textContent;
                    isValid = false;
                    errors.push(`- ${label} erfordert einen Wert für "Andere".`);
                    showGuidance(groupId.replace('-group', ''), true);
                }
            }
        });

        return isValid ? true : errors.join('\n');
    }

    function getValueFromGroup(groupId) {
        const selectedOption = document.querySelector(`#${groupId} .option-box.selected`);
        if (!selectedOption) return '';
        return selectedOption.dataset.value !== 'Other'
            ? selectedOption.dataset.value
            : document.querySelector(`#${groupId} input[type="text"]`).value || '';
    }

    window.onload = function() {
        setProgress(0);
    };
