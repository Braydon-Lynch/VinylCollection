document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("recordForm");
    const collectionList = document.getElementById("collectionList");

    let records = JSON.parse(localStorage.getItem("vinylCollection")) || [];
    displayRecords();

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const artist = document.getElementById("artist").value;
        const format = document.getElementById("format").value;
        const year = document.getElementById("year").value;

        const newRecord = { title, artist, format, year };
        records.push(newRecord);

        localStorage.setItem("vinylCollection", JSON.stringify(records));
        displayRecords();

        form.reset();
    });

    function displayRecords() {
        collectionList.innerHTML = "";
        records.forEach((record, index) => {
            const li = document.createElement("li");
            li.innerHTML = 
                `<div class="record-info">
                    <span class="title">${record.title}</span> 
                    <span class="details">${record.artist} - (${record.format} - ${record.year})</span>
                </div>
                <button class="remove-btn" onclick="removeRecord(${index})">X</button>`;
            collectionList.appendChild(li);
        });
    }

    window.removeRecord = (index) => {
        records.splice(index, 1);
        localStorage.setItem("vinylCollection", JSON.stringify(records));
        displayRecords();
    };
});