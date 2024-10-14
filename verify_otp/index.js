let allInputs = document.querySelectorAll('input');
[...allInputs].map((item) => {
    item.addEventListener('keydown', (e) => {
        item.value = '';
        if (e.key === 'Backspace') {
            if ((Number(item.dataset.index) - 1) >= 0) {
                let elem = document.querySelector(`input[data-index="${Number(item.dataset.index) - 1}"]`)
                setTimeout(() => elem.focus(), 10);
            }
        } else {

            if ((Number(item.dataset.index) + 1) < allInputs.length) {
                let elem = document.querySelector(`input[data-index="${Number(item.dataset.index) + 1}"]`)
                setTimeout(() => elem.focus(), 10);
            }
        }

    })
})