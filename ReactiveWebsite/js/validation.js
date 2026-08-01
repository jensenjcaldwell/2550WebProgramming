(function () {
    if (window.__ReactiveWebsiteValidationInitialized) {
        return;
    }

    window.__ReactiveWebsiteValidationInitialized = true;

    const stateAbbreviations = ['AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    const zipRegex = /^\d{5}(?:-\d{4})?$/;
    const phoneRegex = /^(?:\+?1[\s./-]?)?\(?\d{3}\)?[\s./-]?\d{3}[\s./-]?\d{4}$/;

    function normalizeFieldName(input) {
        const candidate = input && typeof input === 'object' ? (input.name || input.id || '') : '';
        return candidate.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    function getFieldValue(input) {
        if (typeof input === 'string') {
            return input.trim();
        }

        const rawValue = input && typeof input === 'object' && 'value' in input ? input.value : '';
        return String(rawValue == null ? '' : rawValue).trim();
    }

    function getErrorBox(input) {
        if (!input || typeof input !== 'object' || !input.parentElement) {
            return null;
        }

        return input.parentElement.querySelector('.error-message');
    }

    function setFieldState(input, isValid) {
        if (!input || typeof input !== 'object') {
            return;
        }

        input.classList.toggle('was-validated', !isValid);
        input.classList.toggle('is-valid', isValid);
        input.classList.toggle('is-invalid', !isValid);
    }

    function showError(input, message) {
        const errorBox = getErrorBox(input);
        if (errorBox) {
            errorBox.textContent = message;
        }
    }

    function clearError(input) {
        const errorBox = getErrorBox(input);
        if (errorBox) {
            errorBox.textContent = '';
        }
    }

    function validateRequired(input) {
        const value = getFieldValue(input);
        const isValid = value.length > 0;
        if (input && typeof input === 'object') {
            setFieldState(input, isValid);
            showError(input, isValid ? '' : 'This field is required.');
        }
        return isValid;
    }

    function validateState(input) {
        const value = getFieldValue(input).toUpperCase();
        const isValid = stateAbbreviations.includes(value);
        if (input && typeof input === 'object') {
            setFieldState(input, isValid);
            showError(input, isValid ? '' : 'Enter a valid two-letter state abbreviation.');
        }
        return isValid;
    }

    function validateZip(input) {
        const value = getFieldValue(input);
        const isValid = zipRegex.test(value) && value.length >= 5;
        if (input && typeof input === 'object') {
            setFieldState(input, isValid);
            showError(input, isValid ? '' : 'Enter a valid ZIP code (12345 or 12345-6789).');
        }
        return isValid;
    }

    function validatePhone(input) {
        const value = getFieldValue(input);
        let isValid = false;

        try {
            if (!value) {
                isValid = false;
            } else {
                const digitsOnly = value.replace(/\D/g, '');
                const hasValidLength = digitsOnly.length === 10 || digitsOnly.length === 11;
                isValid = phoneRegex.test(value) && hasValidLength && !/[a-zA-Z]/.test(value);
            }
        } catch (_error) {
            isValid = false;
        }

        if (input && typeof input === 'object') {
            setFieldState(input, isValid);
            showError(input, isValid ? '' : 'Enter a valid phone number.');
        }

        return Boolean(isValid);
    }

    function validateEmail(input) {
        let isValid = false;

        try {
            const value = getFieldValue(input);
            const parts = value.split('@');
            const hasSingleAt = parts.length === 2;
            const local = hasSingleAt ? parts[0] : '';
            const domain = hasSingleAt ? parts[1] : '';
            const hasNoConsecutiveDots = !value.includes('..');
            const hasValidEdgeDots = Boolean(local && !local.startsWith('.') && !local.endsWith('.') && !domain.startsWith('.') && !domain.endsWith('.'));
            isValid = Boolean(hasSingleAt && hasNoConsecutiveDots && hasValidEdgeDots && emailRegex.test(value));
        } catch (_error) {
            isValid = false;
        }

        if (input && typeof input === 'object') {
            setFieldState(input, isValid);
            showError(input, isValid ? '' : 'Enter a valid email address.');
        }
        return Boolean(isValid);
    }

    function validateCheckboxGroup(groupName) {
        const boxes = Array.from(document.querySelectorAll(`input[name="${groupName}"]`));
        const isValid = boxes.some((box) => box.checked);
        boxes.forEach((box) => {
            box.classList.toggle('was-validated', !isValid);
            box.classList.toggle('is-invalid', !isValid);
        });
        const feedback = document.querySelector('.discovery-feedback');
        if (feedback) {
            feedback.textContent = isValid ? '' : 'Select at least one discovery method.';
        }
        return isValid;
    }

    function syncDiscoveryAliases() {
        const discoveryBoxes = Array.from(document.querySelectorAll('input[name="discovery"]'));
        const findUsBoxes = Array.from(document.querySelectorAll('input[name="find-us"]'));
        if (!discoveryBoxes.length || !findUsBoxes.length) {
            return;
        }

        discoveryBoxes.forEach((box) => {
            const alias = document.querySelector(`input[name="find-us"][value="${box.value}"]`);
            if (alias) {
                alias.checked = box.checked;
            }
        });
    }

    function validateDiscoverySelection() {
        syncDiscoveryAliases();
        const hasFindUs = document.querySelector('input[name="find-us"]');
        const hasDiscovery = document.querySelector('input[name="discovery"]');
        if (hasDiscovery) {
            return validateCheckboxGroup('discovery');
        }
        return hasFindUs ? validateCheckboxGroup('find-us') : validateCheckboxGroup('discovery');
    }

    function validateField(input) {
        if (!input || typeof input !== 'object') {
            return true;
        }

        const fieldName = normalizeFieldName(input);

        if (fieldName === 'comments') {
            clearError(input);
            input.classList.remove('is-invalid', 'is-valid', 'was-validated');
            return true;
        }

        if (fieldName === 'state') {
            return validateState(input);
        }
        if (fieldName === 'zip' || fieldName === 'zipcode') {
            return validateZip(input);
        }
        if (fieldName === 'phone' || fieldName === 'cellphone' || fieldName === 'phonenumber') {
            return validatePhone(input);
        }
        if (fieldName === 'email' || fieldName === 'emailaddress') {
            return validateEmail(input);
        }
        if (input.type === 'checkbox') {
            return validateDiscoverySelection();
        }
        if (fieldName === 'firstname' || fieldName === 'lastname' || fieldName === 'address' || fieldName === 'city') {
            return validateRequired(input);
        }
        return validateRequired(input);
    }

    function showSuccessfulSubmission(form) {
        if (!form) {
            return;
        }

        const successMessage = document.getElementById('form-success-message');
        const formBlock = document.getElementById('visitor-form');

        if (formBlock) {
            formBlock.style.display = 'none';
        }

        form.style.display = 'none';

        if (successMessage) {
            successMessage.hidden = false;
            successMessage.style.display = 'block';
        }
    }

    function validateForm(form) {
        const targetForm = form || document.getElementById('myform');
        if (!targetForm) {
            return false;
        }

        targetForm.classList.add('was-validated');
        targetForm.classList.add('was-validated-form');

        const inputs = Array.from(targetForm.querySelectorAll('input:not([type="hidden"]), textarea, select'));
        const results = inputs.map((input) => {
            if (input.type === 'checkbox') {
                return validateDiscoverySelection();
            }
            if (input.name) {
                return validateField(input);
            }
            return true;
        });

        const isCustomValid = results.every(Boolean);
        const isBrowserValid = typeof targetForm.checkValidity === 'function' ? targetForm.checkValidity() : true;
        const isValid = isCustomValid && isBrowserValid;

        if (isValid) {
            showSuccessfulSubmission(targetForm);
        }

        return isValid;
    }

    function initializeValidation(formId) {
        const form = document.getElementById(formId);
        if (!form) {
            return;
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const isValid = validateForm(form);
            const hasValidationState = form.classList.contains('was-validated');

            if (!hasValidationState) {
                form.classList.add('was-validated');
            }

            return isValid;
        });

        form.querySelectorAll('input, textarea').forEach((input) => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('change', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    validateField(input);
                }
            });
        });

        form.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            checkbox.addEventListener('change', () => validateDiscoverySelection());
        });
    }

    window.ValidationApp = window.ValidationApp || {};
    window.ValidationApp.initializeValidation = initializeValidation;
    window.ValidationApp.validateRequired = validateRequired;
    window.ValidationApp.validateState = validateState;
    window.ValidationApp.validateZip = validateZip;
    window.ValidationApp.validatePhone = validatePhone;
    window.ValidationApp.validateEmail = validateEmail;
    window.ValidationApp.validateForm = validateForm;
    window.ValidationApp.validateField = validateField;

    window.validateRequired = validateRequired;
    window.validateState = validateState;
    window.validateZip = validateZip;
    window.validatePhone = validatePhone;
    window.validateEmail = validateEmail;
    window.validateForm = validateForm;
    window.validateField = validateField;
    window.validate = validateForm;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initializeValidation('myform'));
    } else {
        initializeValidation('myform');
    }
})();
