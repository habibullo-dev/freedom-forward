document.addEventListener("DOMContentLoaded", (event) => {
  let cardsShown = 9;
  let currentMode = 'nations';
  const toggle = document.querySelector(".toggle-control input");
  const viewMoreBtn = document.querySelector(".view-more-btn");
  const palestineCards = document.querySelectorAll("#palestine-side .card");
  const israelCards = document.querySelectorAll("#israel-side .card");
  const nationBrandLink = document.querySelector('#nation-brand-link');
  const nationsLink = document.querySelector('#nations-link');
  const brandsLink = document.querySelector('#brands-link');
  const h1Element = document.querySelector('#title');
  const pElement = document.querySelector('#brief-info');

  const updateActiveLink = (activeLink) => {
    [nationsLink, brandsLink, nationBrandLink].forEach(link => {
      link === activeLink ? link.classList.add('active') : link.classList.remove('active');
    });
  };

  const linkClickHandler = (mode) => (e) => {
    e.preventDefault();
    currentMode = mode;
    cardsShown = 9;
    updateCards(currentMode);
    updateActiveLink(e.target);
  };

  nationsLink.addEventListener('click', linkClickHandler('nations'));
  brandsLink.addEventListener('click', linkClickHandler('brands'));
  nationBrandLink.addEventListener('click', linkClickHandler('nation-brand'));

  viewMoreBtn.addEventListener("click", () => {
    cardsShown += 6;
    updateCards(currentMode);
  });

  function showCards(cards) {
    cards.forEach((card, i) => {
      if (i < cardsShown) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  function hideCards(cards) {
    cards.forEach((card) => {
      card.style.display = "none";
    });
  }

  // Show more/less button code below

  // Get all elements with the specified classes
  var showMoreContents = document.getElementsByClassName("show-more-content");
  var showMores = document.getElementsByClassName("show-more");
  var showLesses = document.getElementsByClassName("show-less");

  // Loop over each set of elements
  for (let i = 0; i < showMores.length; i++) {
    let showMoreContent = showMoreContents[i];
    let showMore = showMores[i];
    let showLess = showLesses[i];

    // Initially hide the 'show-more-content' and 'show-less' elements
    showMoreContent.style.display = "none";
    showLess.style.display = "none";

    // Add event listener to 'show-more' element
    showMore.addEventListener("click", function () {
      showMoreContent.style.display = "block";
      showLess.style.display = "block";
      this.style.display = "none";
    });

    // Add event listener to 'show-less' element
    showLess.addEventListener("click", function () {
      showMoreContent.style.display = "none";
      showMore.style.display = "block";
      this.style.display = "none";
    });
  }

  // Inserting the data to cards

  // Data sets

  let palestineBrands, palestineCountries, israelBrands, israelCountries;

  // Call updateCards with currentMode as argument
  fetch("/api/data")
    .then((response) => response.json())
    .then((data) => {
      palestineBrands = data.palestineBrands;
      palestineCountries = data.palestineCountries;
      israelBrands = data.israelBrands;
      israelCountries = data.israelCountries;
      updateCards(currentMode); // Call updateCards after the data is fetched
    })
    .catch((error) => console.error("Error:", error));


  // Inserting the data to cards

  function insertCardData(cardInfo, cardElement) {
    let imgElement = cardElement.querySelector(".card-img-top");
    let textElement = cardElement.querySelector(".card-text");
    let moreContentElement = cardElement.querySelector(".show-more-content p");
    let cardLinkElement = cardElement.querySelector(".reference-link"); // Select the element where you want to insert the link

    if (imgElement) imgElement.src = cardInfo.image_link;
    if (textElement) textElement.textContent = cardInfo.news.brief;
    if (moreContentElement)
      moreContentElement.textContent = cardInfo.news.detailed;
    if (cardLinkElement) cardLinkElement.href = cardInfo.reference; // Set the href attribute to the reference link
  }

  // Update the insertData function to take only two arguments
  function insertData(data, cardElements) {
    if (data) {
      for (let i = 0; i < data.length; i++) {
        insertCardData(data[i], cardElements[i]);
      }
    }
  }

  function updateCards(mode) {

    if (mode === 'nations') {
      if (toggle.checked) {
        showCards(palestineCards);
        hideCards(israelCards);
        insertData(palestineCountries, palestineCards);

        // Set the h1 and p content for the Palestine side
        h1Element.textContent = "Stand with Palestine";
        pElement.textContent = "Your source for supporting Palestine and advocating for justice.";

      } else {
        showCards(israelCards);
        hideCards(palestineCards);
        insertData(israelCountries, israelCards);
        // Set the h1 and p content for the Israel side
        h1Element.textContent = "Boycott Israel: Nonviolent Activism for Palestinian Rights";
        pElement.textContent = "Together we can promote activism, boycotts, and nonviolent resistance to achieve justice.";
      }


    } else if (mode === 'brands') {
      if (toggle.checked) {
        showCards(palestineCards);
        hideCards(israelCards);
        insertData(palestineBrands, palestineCards);

        // Set the h1 and p content for the Palestine side
        h1Element.textContent = "Stand with Palestine";
        pElement.textContent = "Your source for supporting Palestine and advocating for justice.";

      } else {
        showCards(israelCards);
        hideCards(palestineCards);
        insertData(israelBrands, israelCards);
        // Set the h1 and p content for the Israel side
        h1Element.textContent = "Boycott Israel: Nonviolent Activism for Palestinian Rights";
        pElement.textContent = "Together we can promote activism, boycotts, and nonviolent resistance to achieve justice.";
      }


    } else if (mode === 'nation-brand') {
      if (toggle.checked) {
        showCards(palestineCards);
        hideCards(israelCards);
        insertData([...palestineBrands, ...palestineCountries], palestineCards);
        // Set the h1 and p content for the Palestine side
        h1Element.textContent = "Stand with Palestine";
        pElement.textContent = "Your source for supporting Palestine and advocating for justice.";

      } else {
        showCards(israelCards);
        hideCards(palestineCards);
        insertData([...israelBrands, ...israelCountries], israelCards);
        // Set the h1 and p content for the Israel side
        h1Element.textContent = "Boycott Israel: Nonviolent Activism for Palestinian Rights";
        pElement.textContent = "Together we can promote activism, boycotts, and nonviolent resistance to achieve justice.";
      }

    }



  }

  // Call updateCards when the page loads and when the toggle state changes
  updateCards(currentMode);
  if (toggle) {
    toggle.addEventListener("change", () => updateCards(currentMode));
  } else {
    console.error("Toggle element not found");
  }

  const searchInput = document.querySelector('input[type="search"]');
  const searchButton = document.querySelector(".btn-outline-success"); // Changed this line

  function removeHighlights() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(function (card) {
      card.innerHTML = card.innerHTML.replace(/<mark>(.*?)<\/mark>/gi, "$1");

      // Re-attach the event listeners to the 'show-more' and 'show-less' buttons
      const showMore = card.querySelector(".show-more");
      const showLess = card.querySelector(".show-less");
      const showMoreContent = card.querySelector(".show-more-content");

      showMore.addEventListener("click", function () {
        showMoreContent.style.display = "block";
        showLess.style.display = "block";
        this.style.display = "none";
      });

      showLess.addEventListener("click", function () {
        showMoreContent.style.display = "none";
        showMore.style.display = "block";
        this.style.display = "none";
      });
    });
  }

  searchInput.addEventListener("input", function () {
    if (this.value === "") {
      removeHighlights();
    }
  });

  searchButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the form from being submitted normally
    removeHighlights();

    const query = searchInput.value.toLowerCase();
    let cards = Array.from(toggle.checked ? palestineCards : israelCards); // Use the cards that are currently visible
    let found = false;

    while (!found && cards.length > 0) {
      cards = cards.filter(function (card) {
        if (card.style.display !== "none") {
          // Only search through cards that are not hidden
          const text = card.textContent.toLowerCase();
          if (text.includes(query)) {
            found = true;
            const regex = new RegExp(`(${query})`, "gi");
            card.innerHTML = card.innerHTML.replace(regex, "<mark>$1</mark>");
            card.scrollIntoView({ behavior: "smooth" });

            // Re-attach the event listeners to the 'show-more' and 'show-less' buttons
            const showMore = card.querySelector(".show-more");
            const showLess = card.querySelector(".show-less");
            const showMoreContent = card.querySelector(".show-more-content");

            showMore.addEventListener("click", function () {
              showMoreContent.style.display = "block";
              showLess.style.display = "block";
              this.style.display = "none";
            });

            showLess.addEventListener("click", function () {
              showMoreContent.style.display = "none";
              showMore.style.display = "block";
              this.style.display = "none";
            });
          }
        }
        return !found;
      });

      if (!found && cardsShown >= cards.length) {
        // If the search term was not found and all cards have been searched, break the loop
        break;
      } else if (!found) {
        // If the search term was not found, load more cards and continue the search
        cardsShown += 6;
        updateCards(currentMode);
        cards = Array.from(toggle.checked ? palestineCards : israelCards);
      }
    }
    if (!found) {
      alert('No information found for your search.');
    }
  });
});