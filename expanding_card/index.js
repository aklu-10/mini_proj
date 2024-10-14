const handleChange = e => {
    let clickedDiv = e.target;
    let allItems = document.querySelectorAll('.container-item');
    [...allItems].map(item=>item.classList.remove('active-item'))
    clickedDiv.classList.add('active-item')
}