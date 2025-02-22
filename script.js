document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("recordForm");
    const collectionList = document.getElementById("collectionList");

    // Load existing records from local storage
    let records = JSON.parse(localStorage.getItem("vinylCollection")) || [];
    displayRecords();

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const artist = document.getElementById("artist").value;
        const format = document.getElementById("format").value;
        const year = document.getElementById("year").value;
        const genre = document.getElementById("genre").value;

        const newRecord = { title, artist, format, year, genre };
        records.push(newRecord);

        localStorage.setItem("vinylCollection", JSON.stringify(records));
        displayRecords();

        form.reset();
    });

    function displayRecords() {
        collectionList.innerHTML = "";
    
        const genres = ["Rock", "Pop", "Rap", "Country/Folk", "Alt.", "Other"];
    
        genres.forEach((genre) => {
            const genreRecords = records.filter(record => record.genre === genre);
    
            const genreSection = document.createElement("div");
            genreSection.classList.add("genre-section");
            genreSection.innerHTML = `<h3 class="genre-title">${genre}</h3>`;
    
            if (genreRecords.length === 0) {
                genreSection.innerHTML += "<p style='color: #888; font-style: italic;'>No records added yet</p>";
                collectionList.appendChild(genreSection);
                return;
            }
    
            genreRecords.sort((a, b) => {
                return getSortKey(a.artist).localeCompare(getSortKey(b.artist));
            });
    
            let currentLetter = "";
            const ul = document.createElement("ul");
    
            genreRecords.forEach((record) => {
                const sortKey = getSortKey(record.artist);
                const firstLetter = sortKey.charAt(0).toUpperCase();
    
                if (firstLetter !== currentLetter) {
                    currentLetter = firstLetter;
                    const letterDivider = document.createElement("li");
                    letterDivider.classList.add("alphabet-divider");
                    letterDivider.textContent = currentLetter;
                    ul.appendChild(letterDivider);
                }
    
                const li = document.createElement("li");
                li.innerHTML = `
                    <div class="record-info">
                        <span class="title">${record.title}</span>
                        <span class="details">${record.artist} • ${record.format} • ${record.year}</span>
                    </div>
                    <button class="remove-btn" onclick="removeRecord('${record.title}', '${record.artist}', '${record.genre}')">✖</button>
                `;
                ul.appendChild(li);
            });
    
            genreSection.appendChild(ul);
            collectionList.appendChild(genreSection);
        });
    }
    
    // Helper function to determine sorting key (ignores "The")
    function getSortKey(artist) {
        let words = artist.split(" ");
        if (words[0].toLowerCase() === "the" && words.length > 1) {
            return words[1].toLowerCase(); // Ignore "The" and sort by the next word
        }
        return words[words.length - 1].toLowerCase(); // Sort by last word
    }

    window.removeRecord = (title, artist, genre) => {
        records = records.filter(record => !(record.title === title && record.artist === artist && record.genre === genre));
        localStorage.setItem("vinylCollection", JSON.stringify(records));
        displayRecords();
    };
});