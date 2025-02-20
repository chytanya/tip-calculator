document.addEventListener('DOMContentLoaded', () => {
    const billInput = document.getElementById('bill-amount');
    const taxRateInput = document.getElementById('tax-rate');
    const numPeopleInput = document.getElementById('num-people');
    const diningTypeSelect = document.getElementById('dining-type');
    const currencySelect = document.getElementById('currency');
    const customTipInput = document.getElementById('custom-tip');
    const serviceButtons = document.querySelectorAll('.service-btn');
    const tipAmountDisplay = document.getElementById('tip-amount');
    const taxAmountDisplay = document.getElementById('tax-amount');
    const tipPerPersonDisplay = document.getElementById('tip-per-person');
    const totalAmountDisplay = document.getElementById('total-amount');
    const totalPerPersonDisplay = document.getElementById('total-per-person');
    const challengeResult = document.getElementById('challenge-result');

    let tipPercentage = 15; // Default to "Good" service

    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });

    // Voice Input
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = (event) => {
        billInput.value = parseFloat(event.results[0][0].transcript) || 0;
        calculate();
    };
    document.getElementById('voice-btn').addEventListener('click', () => recognition.start());

    // Service Buttons
    serviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            serviceButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            if (button.dataset.tip === 'custom') {
                customTipInput.style.display = 'block';
                tipPercentage = parseFloat(customTipInput.value) || 0;
            } else {
                customTipInput.style.display = 'none';
                tipPercentage = parseFloat(button.dataset.tip);
            }
            calculate();
        });
    });

    // Dining Type Suggestions
    diningTypeSelect.addEventListener('change', () => {
        const tipMap = { restaurant: 20, delivery: 10, bar: 15 };
        tipPercentage = tipMap[diningTypeSelect.value] || tipPercentage;
        calculate();
    });

    // Real-Time Calculation
    [billInput, taxRateInput, numPeopleInput, customTipInput, currencySelect].forEach(input => {
        input.addEventListener('input', calculate);
    });

    // Load History
    updateHistory();

    function calculate() {
        const bill = parseFloat(billInput.value) || 0;
        const taxRate = parseFloat(taxRateInput.value) || 0;
        const numPeople = parseInt(numPeopleInput.value) || 1;
        const currency = currencySelect.value;

        // Tax Calculation
        const tax = bill * (taxRate / 100);
        const tip = bill * (tipPercentage / 100);
        const total = bill + tax + tip;

        // Per Person Calculations
        const tipPerPerson = tip / numPeople;
        const totalPerPerson = total / numPeople;

        // Currency Conversion Placeholder (API needed)
        const convertedTotal = total; // Replace with API call like convertCurrency(total, 'USD', currency)

        // Update Displays
        taxAmountDisplay.textContent = `$${tax.toFixed(2)}`;
        tipAmountDisplay.textContent = `$${tip.toFixed(2)}`;
        tipPerPersonDisplay.textContent = `$${tipPerPerson.toFixed(2)}`;
        totalAmountDisplay.textContent = `$${convertedTotal.toFixed(2)} (${currency})`;
        totalPerPersonDisplay.textContent = `$${totalPerPerson.toFixed(2)} (${currency})`;

        // Animate Results
        document.querySelectorAll('.result-group p').forEach(p => {
            p.classList.remove('show');
            setTimeout(() => p.classList.add('show'), 10);
        });

        // Tip Challenge
        if (Math.abs(tip - 5) < 0.01) {
            challengeResult.textContent = "Perfect $5 tip! 🎉";
        } else {
            challengeResult.textContent = `Tip is $${(5 - tip).toFixed(2)} away from $5 challenge!`;
        }

        // Save to History
        saveToHistory(bill, tip, total, currency);
    }

    // History Functions
    function saveToHistory(bill, tip, total, currency) {
        const history = JSON.parse(localStorage.getItem('tipHistory')) || [];
        history.unshift({ bill, tip, total, currency, date: new Date().toLocaleString() });
        localStorage.setItem('tipHistory', JSON.stringify(history.slice(0, 10)));
        updateHistory();
    }

    function updateHistory() {
        const history = JSON.parse(localStorage.getItem('tipHistory')) || [];
        const list = document.getElementById('history-list');
        list.innerHTML = history.map(h => `<li>${h.date}: $${h.bill} + $${h.tip} = $${h.total} (${h.currency})</li>`).join('');
    }

    // Placeholder for Currency Conversion (requires API)
    async function convertCurrency(amount, from, to) {
        // Example: fetch(`https://api.exchangeratesapi.io/v1/latest?access_key=YOUR_API_KEY&base=${from}&symbols=${to}`)
        // For demo, return unchanged amount
        return amount;
    }
});