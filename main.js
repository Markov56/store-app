function fetchData() {
  return fetch("https://veryfast.io/t/front_test_api.php")
    .then((response) => response.json())
    .then(({ result }) => result)
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function downloadFile(link) {
  window.location.href = link;
}

function getPeriodLabel(text) {
  return text.toLowerCase().includes("year") ? "/per year" : "/mo";
}

function extractPercentage(str) {
  const match = str.match(/\d+%/);
  return match ? match[0] : null;
}

function createBestValueLabel() {
  let bestValueLabel = document.createElement("span");

  bestValueLabel.classList.add("best-value");
  bestValueLabel.textContent = "Best Value";

  return bestValueLabel;
}

function createDiscountLabel(discount) {
  let discountContainer = document.createElement("div");
  discountContainer.classList.add("discount-wrapper");

  let discountImg = document.createElement("img");
  discountImg.classList.add("discount");
  discountImg.src = "images/discount.png";

  let discountPercentage = document.createElement("span");
  discountPercentage.classList.add("percentage");
  discountPercentage.textContent = discount;

  discountContainer.appendChild(discountImg);
  discountContainer.appendChild(discountPercentage);

  return discountContainer;
}

function createPrice({ amount, period, isBest, discount }) {
  let price = document.createElement("div");
  price.classList.add("price");

  let amountEl = document.createElement("span");
  amountEl.classList.add("amount");
  amountEl.textContent = `$${amount}`;

  let periodEl = document.createElement("span");
  periodEl.classList.add("period");
  periodEl.textContent = period;

  price.appendChild(amountEl);
  price.appendChild(periodEl);
  if (discount) {
    price.appendChild(createDiscountLabel(discount));
  }
  if (isBest) {
    price.appendChild(createBestValueLabel());
  }
  return price;
}

function createCardTitle(title, license) {
  let titleWrapper = document.createElement("div");
  titleWrapper.classList.add("title-wrapper");

  let titleEl = document.createElement("p");
  titleEl.classList.add("title");
  titleEl.textContent = title;

  let licenseEl = document.createElement("p");
  licenseEl.classList.add("license");
  licenseEl.textContent = license;

  titleWrapper.appendChild(titleEl);
  titleWrapper.appendChild(licenseEl);

  return titleWrapper;
}

function createDownloadButton(link) {
  let buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("button-wrapper");

  let buttonEl = document.createElement("button");
  buttonEl.classList.add("download");
  buttonEl.textContent = "Download";
  buttonEl.addEventListener("click", () => {
    downloadFile(link);
    if (window.innerWidth > 756) {
      setTimeout(() => {
        document.querySelector(".open-file").style.display = "block";
      }, 1500);
    }
  });

  buttonWrapper.appendChild(buttonEl);

  return buttonWrapper;
}

function createCards(data) {
  let cardsList = document.getElementById("cards-list");
  data.elements.forEach((item) => {
    let card = document.createElement("li");

    card.classList.add("card");

    card.appendChild(
      createPrice({
        amount: item.amount,
        period: getPeriodLabel(item.name_display),
        isBest: item.is_best,
        discount: extractPercentage(item.price_key) || null,
      })
    );

    card.appendChild(createCardTitle(item.name_prod, item.license_name));

    card.appendChild(createDownloadButton(item.link));

    cardsList.appendChild(card);
  });
}

fetchData()
  .then((data) => {
    createCards(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
