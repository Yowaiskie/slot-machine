let credits = 100;

document.getElementById('betButton').addEventListener('click', placeBet);
document.getElementById('spinButton').addEventListener('click', spinReels);

function placeBet() {
    const betAmount = parseInt(document.getElementById('betAmount').value, 10);
    if (betAmount <= 0) {
        alert('Please place a valid bet.');
        return;
    }
    if (betAmount > credits) {
        alert('You do not have enough credits to place this bet.');
        return;
    }
    credits -= betAmount;
    updateCreditsDisplay();
    document.getElementById('spinButton').disabled = false;
    document.getElementById('betButton').disabled = true;
}

function updateCreditsDisplay() {
    document.getElementById('credits').innerText = credits;
}

function spinReels() {
    const betAmount = parseInt(document.getElementById('betAmount').value, 10);
    if (betAmount <= 0) {
        alert('Please place a valid bet.');
        document.getElementById('spinButton').disabled = false;
        document.getElementById('betButton').disabled = false;
        return;
    }

    document.getElementById('spinButton').disabled = true;
    const symbols = ['🍒', '🍋', '🍉', '🍇', '🔔', '⭐', '7️⃣'];
    const reels = document.querySelectorAll('.reel');
    reels.forEach(reel => {
        reel.innerHTML = ''; // Clear existing emojis
        const spinningSymbols = Array.from({ length: 20 }, () => {
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            const span = document.createElement('span');
            span.textContent = symbol;
            return span;
        });
        spinningSymbols.forEach(symbol => reel.appendChild(symbol));
        reel.classList.add('spinning');
    });

    setTimeout(() => {
        reels.forEach(reel => {
            reel.classList.remove('spinning');
            const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            reel.innerHTML = `<span>${finalSymbol}</span>`;
        });

        const [reel1, reel2, reel3] = Array.from(reels).map(reel => reel.textContent);
        checkResult(reel1, reel2, reel3, betAmount);
        document.getElementById('betButton').disabled = false;

        // Check if credits are zero after the spin results
        if (credits <= 0) {
            document.getElementById('result').innerText = 'Insufficient funds';
            document.getElementById('betButton').disabled = true;
            document.getElementById('spinButton').disabled = true;
        }
    }, 2000); // Extended delay for a clear animation display
}

function checkResult(reel1, reel2, reel3, betAmount) {
    const resultElement = document.getElementById('result');

    if (reel1 === reel2 && reel2 === reel3) {
        resultElement.innerText = 'Jackpot! 🎉';
        credits += betAmount * 10; // Payout 10x for jackpot
    } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
        resultElement.innerText = 'Two of a kind! 😊';
        credits += Math.floor(betAmount * 1.5); // Payout 1.5x for two of a kind (50% of the bet)
    } else {
        resultElement.innerText = 'Try again! 😔';
    }
    updateCreditsDisplay();
}
