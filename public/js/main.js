document.addEventListener('DOMContentLoaded', function() {
   
    const deleteButton = document.querySelector('.delete-article'); 
    deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target;
        const id = target.getAttribute('data-id');
        fetch('/articles/' + id, {
            method: 'DELETE',
        })
        .then(response => {
            // console.log('Success: ', response);
            window.location.href = '/'; 
        })
        .catch(err => console.error('Error: ', err));
    });
});