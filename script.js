document.addEventListener('DOMContentLoaded', () => {
    const billInput = document.getElementById('bill-amount');
    const customTipInput = document.getElementById('custom-tip');
    const serviceButtons = document.querySelectorAll('.service-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const tipAmountDisplay = document.getElementById('tip-amount');
    const totalAmountDisplay = document.getElementById('total-amount');

    let tipPercentage = 15; // Default to "Good" service

    // Handle service button clicks
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
        });
    });

    // Update tip percentage when custom input changes
    customTipInput.addEventListener('input', () => {
        tipPercentage = parseFloat(customTipInput.value) || 0;
    });

    // Calculate tip and total
    calculateBtn.addEventListener('click', () => {
        const bill = parseFloat(billInput.value) || 0;

        if (bill <= 0) {
            alert('Please enter a valid bill amount.');
            return;
        }

        const tip = bill * (tipPercentage / 100);
        const total = bill + tip;

        tipAmountDisplay.textContent = `$${tip.toFixed(2)}`;
        totalAmountDisplay.textContent = `$${total.toFixed(2)}`;
    });
});