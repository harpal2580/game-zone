function showContent(section) {
    console.log(section);
    
    // Hide all content
    const contents = document.querySelectorAll('.content_hide');
    contents.forEach(content => content.classList.remove('active'));

    // Show the selected content
    document.getElementById(section).classList.add('active');
}